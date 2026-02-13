const supabase = require('./server/supabaseClient');

async function listAllStatuses() {
    const { data, error } = await supabase
        .from('resources')
        .select('id, title, status');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${data.length} resources:`);
    data.forEach(r => {
        console.log(`- ID: ${r.id}, Status: ${r.status}, Title: ${r.title}`);
    });
}

listAllStatuses();
