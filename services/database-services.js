function addUserIdToInvoice(invoice, userId){
    invoice.userId = userId
    for(let invoiceItem of invoice.invoiceItems){
        invoiceItem.userId = userId
    }
    return invoice
};

module.exports = {
    addUserIdToInvoice
};