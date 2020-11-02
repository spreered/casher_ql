class Cashier{
  constructor(){
    this.$show_panel = $('#show_panel')
    this.$control_panel = $('#control_panel')
    this.show()
    this.edit()
  }
  show() {
    let query = `
      {
        allItems{
          id
          name
          number
        }
      }`
    let that = this
    let callback = function(data){
      console.log(data)
      let items = data.data.allItems
      items.sort((a,b)=> a.id - b.id)
      items.forEach((item)=>{
        that.$show_panel.append(`<li>${item.name}: <span id="show-item-${item.id}" >${item.number}</span></li>`)
      })
    }
    this.apiRequeset(query,callback)
  }

  edit(){
    let setEditQuery = function (itemId, result){
      return `
        mutation {
          updateItem(
            id: ${itemId}
            number: ${result}
          ){
              item {
                id
                number
              }
              errors 
          } 
        }`
    }
    this.$control_panel.on("click", "button[data-add]", (e)=>{
      let itemId = e.target.dataset.add
      let $itemNum = $(`#control-item-${itemId}`)
      let result = $itemNum.data('number') + 1
      let query = setEditQuery(itemId, result)
      let callback = function(data){
        console.log("add data:", data)
        $itemNum.data('number',result)
        $itemNum.text(result)
      }
      e.preventDefault()
      this.apiRequeset(query,callback)
      
    })
    this.$control_panel.on("click", "button[data-sub]", (e)=>{
      let itemId = e.target.dataset.sub
      let $itemNum = $(`#control-item-${itemId}`)
      let result = ($itemNum.data('number') - 1 < 0) ? 0 : $itemNum.data('number') - 1
      e.preventDefault()
      let query = setEditQuery(itemId, result)
      let callback = function(data){
        console.log("add data:", data)
        $itemNum.data('number',result)
        $itemNum.text(result)
      }
      this.apiRequeset(query,callback)
    })
    
  }

  apiRequeset(q, callback){
    $.ajax({
      url: "graphql",
      contentType: "application/json",
      data: JSON.stringify({ query: q }),
      method: "POST",
      success(data) {
        callback(data)
      }
    });
  }
}

$(document).on("turbolinks:load", function(){
  new Cashier
 })