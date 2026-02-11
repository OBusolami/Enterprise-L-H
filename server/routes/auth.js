const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST /api/auth/login
// Expects: { email: "user@example.com" }
// Returns: User object (finds existing or creates new)
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // 1. Check if user exists
        const { data: existingUser, error: findError } = await supabase
            .from('app_users')
            .select('*')
            .eq('email', normalizedEmail)
            .maybeSingle();

        if (findError) {
            console.error('Error finding user:', findError);
            throw findError;
        }

        if (existingUser) {
            // Update last_login
            await supabase
                .from('app_users')
                .update({ last_login_at: new Date() })
                .eq('id', existingUser.id);

            return res.json({ message: 'Login successful', user: existingUser });
        }

        // 2. Create new user if not exists
        const { data: newUser, error: createError } = await supabase
            .from('app_users')
            .insert([
                {
                    email: normalizedEmail,
                    username: normalizedEmail.split('@')[0], // Default username
                }
            ])
            .select()
            .single();

        if (createError) {
            console.error('Error creating user:', createError);
            throw createError;
        }

        res.status(201).json({ message: 'User created and logged in', user: newUser });

    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

module.exports = router;
