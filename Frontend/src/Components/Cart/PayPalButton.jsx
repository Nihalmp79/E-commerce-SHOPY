import React from 'react'
import {PayPalButtons,PayPalScriptProvide, PayPalScriptProvider} from '@paypal/react-paypal-js';


const PayPalButton = ({amount,onSuccess,onError}) => {
  return (
    <PayPalScriptProvider options={{"clientId": "AackYuKgjWksKoi9csohmxV9cgJoJn_UyounqZ1ZrOZltTIdWUNAi6Scp8-b6nrbU-Xgfs4uDAjrjAOO"}}>
     <PayPalButtons style={{layout: 'vertical'}} createOrder={(data,actions) => {
        return actions.order.create({
            purchase_units: [{amount: {value: amount}}]
        })
     }} onApprove={(data,actions) => {
        return actions.order.capture().then(onSuccess)
     }} onError={onError}></PayPalButtons>   
    </PayPalScriptProvider>
  )
}

export default PayPalButton
