import { useEffect, useState } from 'react'
// Import restapi for function calls
// Import socket for listening for real time messages
import { PushAPI, CONSTANTS } from '@pushprotocol/restapi';

// Ethers or Viem, both are supported
// import { ethers } from 'ethers';
import { useAccount, useWalletClient } from 'wagmi';

const Chat = () => {
    const {data:walletClient} = useWalletClient();
    const [user,setUser] = useState<PushAPI|null>(null);
    const recipientWalletAddress= "0x961FebC2c125f0d8Bd55dBA919b96E6aFeDFD79D";
    const {address } = useAccount();
    const signMessage = async()=>{        
        const userAlice = await PushAPI.initialize(walletClient, {
            env: CONSTANTS.ENV.STAGING,
          });
          setUser(userAlice);
          
          const stream = await userAlice.initStream([CONSTANTS.STREAM.CHAT])
          stream.on(CONSTANTS.STREAM.CHAT,(message)=>{
            console.log("message",message.message.content)
          })
          stream.connect();
          const aliceChats = await userAlice.chat.list('CHATS');
          console.log("ongoing chats",aliceChats);
    }

    const sendMessage = async () => {
        try {
            const response = await user?.chat.send(recipientWalletAddress, {
                content: 'Hello',
                type: 'Text'
            });
            
            if (response?.messageObj) {
                console.log("Message sent successfully:", response);
                // Handle success (e.g., clear input, show success toast)
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            // Handle error (e.g., show error toast)
        }
    }
    useEffect(()=>{
        const initializePushProtocol = ()=>{
             signMessage();
        }
        if(!user && address){
            initializePushProtocol();
        }
    })
     
    
  return (
    <>
    <div>Chat</div>
    <button onClick={sendMessage} className='bg-blue-500 rounded-lg px-4 py-2'>Send Message</button>
    </>
  )
}

export default Chat