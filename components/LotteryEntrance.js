import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants/index"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    console.log(`ChainId is ${chainId}`)
    const dispatch = useNotification()
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const { runContractFunction: EnterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee

    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumPlayers",
        params: {},

    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const updateUI = async () => {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            //try to read the raffle entrance fee
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",

        })
    }

    return (<div>
        Hi from lottery entrance!
        {raffleAddress
            ? <div className="p-5">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    onClick={async () => {
                        await EnterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error)
                        })
                    }}
                    disabled={isFetching || isLoading}
                >
                    {isFetching || isLoading
                        ? <div className="animate-spin spinner-border h-8  w-8 border-b-2 rounded-full"></div>
                        : <div>Enter Raffle</div>}
                </button>
                <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                <div>Number of Players: {numPlayers}</div>
                <div>Recent Winner: {recentWinner}</div>
            </div>
            : <div>No raffle address detected!</div>}

    </div>)
}