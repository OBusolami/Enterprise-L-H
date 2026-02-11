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

        if (category && category !== 'All') {
            query = query.eq('category', category);
        }

        if (type && type !== 'All') {
            query = query.eq('type', type);
        }

        if (search) {
            const term = `%${search}%`;
            query = query.or(`title.ilike.${term},summary.ilike.${term},context_note.ilike.${term}`);
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
        if (!title || !summary) {
            const metadata = await fetchMetadata(url);
            if (metadata) {
                title = title || metadata.title;
                summary = summary || metadata.description;
            }
        }

        // 3. Insert into Supabase
        const resourceData = {
            url: normalizedUrl,
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

// POST /api/resources/batch - Bulk create resources
router.post('/batch', async (req, res) => {
    try {
        const { urls, category, type, team_id } = req.body;

        if (!urls || !category || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Split by newlines or commas and clean up
        const urlList = Array.isArray(urls)
            ? urls
            : urls.split(/[\n,]+/).map(u => u.trim()).filter(u => u && u.startsWith('http'));

        if (urlList.length === 0) {
            return res.status(400).json({ error: 'No valid URLs provided' });
        }

        const results = {
            successful: [],
            skipped: [],
            failed: []
        };

        const resourcesToInsert = [];

        // Process each URL
        for (const url of urlList) {
            try {
                const normalizedUrl = normalizeUrl(url);

                // 1. Check for duplicates in current DB
                const { data: existingResource } = await supabase
                    .from('resources')
                    .select('url')
                    .eq('url', normalizedUrl)
                    .maybeSingle();

                if (existingResource) {
                    results.skipped.push({ url, reason: 'Already exists' });
                    continue;
                }

                // 2. Fetch metadata
                const metadata = await fetchMetadata(url);

                resourcesToInsert.push({
                    url: normalizedUrl,
                    title: metadata?.title || 'Untitled Resource',
                    summary: metadata?.description || '',
                    category,
                    type,
                    status: 'active',
                    team_id: team_id || null
                });

            } catch (err) {
                console.error(`Error processing URL ${url}:`, err);
                results.failed.push({ url, error: err.message });
            }
        }

        // 3. Bulk insert if we have any
        if (resourcesToInsert.length > 0) {
            const { data, error } = await supabase
                .from('resources')
                .insert(resourcesToInsert)
                .select();

            if (error) throw error;
            results.successful = data;
        }

        res.status(200).json({
            message: 'Batch processing complete',
            summary: {
                total: urlList.length,
                added: resourcesToInsert.length,
                skipped: results.skipped.length,
                failed: results.failed.length
            },
            results
        });

    } catch (error) {
        console.error('Error in batch upload:', error);
        res.status(500).json({ error: 'Failed to process batch upload' });
    }
});

module.exports = router;
