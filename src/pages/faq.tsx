import * as React from "react"
import WalletIcon from "../components/icons/home/walletIcon"
import DepositIcon from "../components/icons/home/depositIcon"
import WithdrawIcon from "../components/icons/home/withdrawIcon"
import Message from "../components/message"

const faqs = [{
    a: "Why should I use Blender?",
    q: "Today if you send TAU, the receiver can see how much TAU you have in the address you sent from. If you want that transaction to remain private, you can use Blender so that the receiver can't see how much TAU you have in your address."
}, {
    a: "Why are there predetermined deposit amounts?",
    q: "There are predetermined deposit amounts so that we can blend all the deposits to keep your transaction anonymous."
}, {
    a: "What's a deposit note?",
    q: "A note is a string of random characters that ensures only you will be able to withdraw this deposit."
}, {
    a: "What do I do if I lost my note?",
    q: "Unfortunately, there's nothing we can do if you lose your note. This is a security feature so that you and only you can withdraw TAU from the smart contract."
}, {
    a: "My withdraw isn't working, what do I do?",
    q: "You can reach out to us on Telegram here."
}, {
    a: "How do I know this is anonymous?",
    q: "This is all open source. You can see our GitHub smart contract here."
}, {
    a: "I don't see my question asked here, what can I do?",
    q: "Please reach out to us on Telegram here."
}]

const Card = ( {a, q}: {a: string, q: string}) => {
    const [extend, setExtend] = React.useState(false)
    return (
        <div onClick={()=>{setExtend(!extend)}} className="card">
            {a}
            <div style={extend? undefined : {display: "none"}} className="answer">{q}</div>
        </div>
    )

}

const FaqPage = () => {
  return (
    <div id="faq">
        <div className="warp">
            <div className="title">FAQ</div>
            <div style={{width: "100%"}}>
                {faqs.map((item, i) => {
                return <Card key={i} a={item.a} q={item.q}></Card>
                })}
            </div>
        </div>
    </div>
  )
}

export default FaqPage

