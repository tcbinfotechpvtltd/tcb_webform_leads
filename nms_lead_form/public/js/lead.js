// Client-side script for Lead form cascading filters

frappe.ui.form.on('Lead', {
    onload: function(frm) {
        // Set up initial filters when form loads
        setup_cascading_filters(frm);
    },

    refresh: function(frm) {
        // Apply filters on form refresh
        setup_cascading_filters(frm);
    },

    source: function(frm) {
        // Handle source field changes
        handle_source_change(frm);
    },
});

function setup_cascading_filters(frm) {
    if (frm.doc.source) {
        // Set filter for Sub-Source
        set_subsource_filter(frm);
    }
}

function handle_source_change(frm) {
    // Clear dependent fields when source changes
    frm.set_value('custom_subsource_', '');
    
    if (frm.doc.source) {
        // Apply new filters
        set_subsource_filter(frm);
    } else {
        // Clear all filters if no source selected
        clear_all_filters(frm);
    }
    
    // Refresh the dependent fields
    frm.refresh_field('custom_subsource_');
}

function set_subsource_filter(frm) {
    frm.set_query('custom_subsource_', function() {
        return {
            filters: {
                'source': frm.doc.source
            }
        };
    });
}



function clear_all_filters(frm) {
    frm.set_query('custom_subsource_', function() {
        return {};
    });
}