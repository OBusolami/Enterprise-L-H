const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/teams - Get all teams
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('teams')
            .select(`
                *,
                resource_count:resources(count)
            `)
            .order('name', { ascending: true });

        if (error) throw error;

        res.json({ data });
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});

// POST /api/teams - Create a new team
router.post('/', async (req, res) => {
    try {
        console.log('Received POST /api/teams request:', req.body);
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Team name is required' });
        }

        const { data, error } = await supabase
            .from('teams')
            .insert([{ name, description }])
            .select();

        if (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(409).json({ error: 'Team with this name already exists' });
            }
            throw error;
        }

        res.status(201).json({ message: 'Team created successfully', data: data[0] });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Failed to create team' });
    }
});

// GET /api/teams/:id - Get specific team details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json({ data });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ error: 'Failed to fetch team' });
    }
});

// DELETE /api/teams/:id - Delete a team
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Unlink resources from this team first to avoid foreign key constraints
        const { error: unlinkError } = await supabase
            .from('resources')
            .update({ team_id: null })
            .eq('team_id', id);

        if (unlinkError) {
            console.error('Error unlinking resources from team:', unlinkError);
            // We continue even if no resources were found/unlinked
        }

        // 2. Delete the team
        const { error } = await supabase
            .from('teams')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Failed to delete team' });
    }
});

module.exports = router;
