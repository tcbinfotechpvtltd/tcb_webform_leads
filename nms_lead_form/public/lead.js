frappe.ui.form.on('Lead', {
    onload: function(frm) {
        console.log("Lead JS Loaded from public/js/lead.js");
        apply_filters(frm);
    },

    refresh: function(frm) {
        apply_filters(frm);
    },

    source: function(frm) {
        // clear dependent values when source changes
        frm.set_value('custom_subsource_', '');
        frm.set_value('custom_source_reference_', '');
        apply_filters(frm);
    }
});

function apply_filters(frm) {
    console.log("apply_filters called. source:", frm.doc.source);

    if (!frm.doc.source) {
        clear_filters(frm);
        console.log("No source selected — cleared filters");
        return;
    }

    // 1) verify DB has matching Sub Source entries
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Sub Source Details",
            filters: { source: frm.doc.source },
            fields: ["name", "sub_source_name", "source"],
            limit_page_length: 100
        },
        callback: function(r) {
            console.log("Sub Source Details get_list result:", r.message);

            // apply client-side filter based on same source field
            frm.set_query('custom_subsource_', function() {
                return {
                    filters: { source: frm.doc.source }
                };
            });

            // refresh to cause Link field to re-evaluate
            frm.refresh_field('custom_subsource_');
        }
    });

    // 2) verify DB has matching Source Reference entries
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: "Source Reference Details",
            filters: { source: frm.doc.source },
            fields: ["name", "reference_name", "source"],
            limit_page_length: 100
        },
        callback: function(r) {
            console.log("Source Reference Details get_list result:", r.message);

            frm.set_query('custom_source_reference_', function() {
                return {
                    filters: { source: frm.doc.source }
                };
            });

            frm.refresh_field('custom_source_reference_');
        }
    });
}

function clear_filters(frm) {
    frm.set_query('custom_subsource_', () => ({}));
    frm.set_query('custom_source_reference_', () => ({}));
    frm.refresh_field('custom_subsource_');
    frm.refresh_field('custom_source_reference_');
}
