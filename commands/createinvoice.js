const Command = require("../base/Command.js");
const { Invoices } = require('paypal-invoices')
class createInvoice extends Command 
{
	constructor (client) 
	{
		super(client, 
		{
			name: "CreateInvoice", //command name, should match class.
			description: "Creates a paypal invoice", //description
			usage: "TBD" //usage details. Should match the name and class
		});
	}

	async run (message, args, level) 
	{ // eslint-disable-line no-unused-vars
		// Create a new API instance
        const api = new Invoices("Aeo32rlk-8Ec22LBq7mB103l0QQ5eVYzB-jrtrmZcqvaUZ8tjFIlJytBIC_vuQ_mPRzaztHu_Zw4p60r", "EIHK8i56BDYlJpZ5oCcZTpi4k-9FN3QHsQ_vfZNbpDRioWWmoPv81GIyuaJjYCDrKyGkftzMdzqZ17jP", true)
        // Or a sandbox api
        // const api = new Invoices(CLIENT_ID, CLIENT_SECRET, true)

        // Initialize the API
        try {
        await api.initialize();
        } catch (e) {
        console.log("Could not initialize");
        return;
        }

        // Get the next Invoice number
        const invoiceNum = await api.generateInvoiceNumber();

        // Create a new Invoice draft
        const link = await api.createDraftInvoice(/* Invoice Object*/);

        // Get the created invoice
        const invoiceDraft = await api.getInvoiceByLink(link);
        console.log(invoiceDraft)
        // Send the new Invoice to the recipient
        //await api.sendInvoice(invoiceDraft.id);
	}
}

module.exports = createInvoice; //<------------ Don't forget this one!
