const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { fetchMetadata } = require('../utils/metadata');

// GET /api/resources - Fetch all resources (active)
// GET /api/resources - Fetch all resources (active)
router.get('/', async (req, res) => {
    try {
        const { team_id, category, type, search } = req.query;
        let query = supabase
            .from('resources')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (team_id) {
            query = query.eq('team_id', team_id);
        }

        if (category && category !== 'All') { // 'All' check to be safe
            query = query.eq('category', category);
        }

        if (type && type !== 'All') {
            query = query.eq('type', type);
        }

        if (search) {
            // Supabase 'ilike' (case-insensitive)
            // Searching title OR summary OR context_note
            // Syntax: .or('col1.ilike.%val%,col2.ilike.%val%')
            const term = `%${search}%`;
            query = query.or(`title.ilike.${term},summary.ilike.${term},context_note.ilike.${term},category.ilike.${term}`);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.json({ data });
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

const { normalizeUrl } = require('../utils/normalization');

// POST /api/resources - Create new resource
router.post('/', async (req, res) => {
    try {
        const { url, title, summary, category, type, personal_context, team_id } = req.body;

        if (!url || !title || !category || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const normalizedUrl = normalizeUrl(url);

        // 1. Check for duplicates
        const { data: existingResource } = await supabase
            .from('resources')
            .select('id')
            .eq('url', normalizedUrl)
            .single();

        if (existingResource) {
            return res.status(409).json({ error: 'Resource with this URL already exists', id: existingResource.id });
        }

        // 2. Fetch metadata if title/summary missing
        // This block is now less likely to be hit if title/summary are required,
        // but kept for potential future flexibility or if client-side doesn't provide them.
        if (!title || !summary) {
            const metadata = await fetchMetadata(url);
            if (metadata) {
                title = title || metadata.title;
                summary = summary || metadata.description;
            }
        }

        // 3. Insert into Supabase
        const resourceData = {
            url: normalizedUrl, // Store normalized version
            title: title || 'Untitled Resource',
            summary,
            context_note: personal_context,
            category,
            type,
            status: 'active',
            team_id: team_id || null
        };

        const { data, error } = await supabase
            .from('resources')
            .insert([resourceData])
            .select();

        if (error) throw error;

        res.status(201).json({ message: 'Resource created successfully', data: data[0] });

    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ error: 'Failed to create resource' });
    }
});

// GET /api/metadata?url=... Helper endpoint for frontend preview
router.get('/metadata', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const metadata = await fetchMetadata(url);
    if (!metadata) return res.status(404).json({ error: 'Could not fetch metadata' });

    res.json({ data: metadata });
});

// DELETE /api/resources/:id - Delete a resource
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('resources')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Error deleting resource:', error);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

module.exports = router;
