import React, { HtmlHTMLAttributes } from "react"
import FeedBackIcon from "../icons/layout/feedback"
import GithubIcon from "../icons/layout/github"
import TelegramIcon from "../icons/layout/telegram"
import TwitterIcon from "../icons/layout/twitter"

const ShareCard: React.FC<HtmlHTMLAttributes<HTMLDivElement> & {href?: string}> = ({ href, children, style}) => {
    return (
        <div className="share-card" style={style}><a target="_blank" href={href}>{children}</a></div>
    )
}

const Footer: React.FC<HtmlHTMLAttributes<HTMLDivElement>> = ({ className }) => {
    return (
        <div id="footer" className={className}>
            <ShareCard href={"https://lamden.io/"} style={{background: '#39DB80'}}><FeedBackIcon /></ShareCard>
            <ShareCard href={"https://lamden.io/"}><TelegramIcon /></ShareCard>
            <ShareCard href={"https://lamden.io/"}><TwitterIcon /></ShareCard>
            <ShareCard href={"http://github.com/"}><GithubIcon /></ShareCard>
        </div>
    )
}

export default Footer