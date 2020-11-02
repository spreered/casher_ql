$(document).on("turbolinks:load", function(){
  let channelId = Math.round(Date.now() + Math.random() * 100000).toString(16)
  App.cashierStream = App.cable.subscriptions.create("CashierStreamChannel", {
    connected() {
      let query = `
        subscription {
          updateItem {
            id
            name
            number
          }
        }
      `
      let variables = {}
      let operationName = ""
      const channelParams = {
        query: query,
        // variables: variables,
        // operationName: operationName,
      }
      // Called when the subscription is ready for use on the server
      // console.log('load notification action');
      console.log('CashierStream channel connected..')
      this.perform('execute', channelParams)
    },

    disconnected() {
      // Called when the subscription has been terminated by the server
      console.log('CashierStream channel disconnected..')
    },

    received(data) {
      const result = data.result
      console.log("get result",result)
      if(result.data){
        // update item number
        const id = result.data.updateItem.id
        const number = result.data.updateItem.number
        const $numberSpan = $(`#show-item-${id}`)
        $numberSpan.text(number)
      }
      
    }
  });
})
