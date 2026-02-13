const supabase = require('./server/supabaseClient');

async function listAll() {
    const { data, error } = await supabase
        .from('resources')
        .select('id, title, status');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- ALL RESOURCES ---');
    data.forEach(r => {
        console.log(`[${r.status}] ${r.title} (${r.id})`);
    });

    const activeCount = data.filter(r => r.status === 'active').length;
    const archivedCount = data.filter(r => r.status === 'archived').length;
    console.log(`\nSummary: Active: ${activeCount}, Archived: ${archivedCount}, Total: ${data.length}`);
}

listAll();
