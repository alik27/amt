class DescriptionService {
    typeofValid (name,type) {
        return ((name && typeof name !== type) ? true : false)
    }
    
    typeofValidAll (number, brand, series, pass_number, pass_type, belonging, name_inventory_items, weight_inventory_items, full_name_inventory_items) {
        if(!number || this.typeofValid(number, 'string') || this.typeofValid(brand, 'string') || this.typeofValid(series, 'string') || this.typeofValid(pass_number, 'number') 
        || this.typeofValid(pass_type, 'string') || this.typeofValid(belonging, 'string') || this.typeofValid(name_inventory_items, 'string') 
        || this.typeofValid(weight_inventory_items, 'number') || this.typeofValid(full_name_inventory_items, 'string')) {
            return true
        }
        return false
    }
}

module.exports = new DescriptionService
