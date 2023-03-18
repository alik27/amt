
const typeofValid = (name,type) => {
    if(name && typeof name !== type) {
        return true
    }
    return false
}

const typeofValidAll = (number, brand, series, pass_number, pass_type, belonging, name_inventory_items, weight_inventory_items, full_name_inventory_items) => {
    if(!number || typeofValid(number, 'string') || typeofValid(brand, 'string') || typeofValid(series, 'string') || typeofValid(pass_number, 'number') || typeofValid(pass_type, 'string')
     || typeofValid(belonging, 'string') || typeofValid(name_inventory_items, 'string') || typeofValid(weight_inventory_items, 'number')
     || typeofValid(full_name_inventory_items, 'string')) {
        return true
    }
    return false
}

module.exports = {
    typeofValid, typeofValidAll
};