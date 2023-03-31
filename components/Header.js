import { ConnectButton } from "web3uikit";

export default function Header() {
    return (
        <div className="p-5 border-b-4 flex flex-row">
            <h1 className="py-4 px-4 font-blog text-3xl">Decetralize Lottery</h1>
            <div className="ml-auto py-2 px-4"></div>
            <ConnectButton moralisAuth={false} />
        </div>)
}