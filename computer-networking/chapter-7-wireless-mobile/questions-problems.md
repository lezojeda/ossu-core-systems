## SECTION 7.1
**R1.** To be operating in "infrastructure mode" means that the network is providing all traditional network services (e.g., address assignment and routing) to the hosts connected.

If it's not in infrastructure mode it's ad hoc mode.

The difference between the ad hoc mode and infrastructure mode is that in the former the wireless hosts have no infrastructure with which to connect. So in the absence of such infrastructure, the hosts themselves must provide for services such as routing, address assignment, DNS-like name
translation, and more.

---
**R2.**
1. **Single**-hop, infrastructure-**based**. Example: home wi-fi, my laptop connected to the router
2. **Single**-hop, infrastructure-**less**. Examples: bluetooth
3. **Multi**-hop, infrastructure-**based**. Examples: the internet, a university network
4. **Multi**-hop, infrastructure-**less**. Examples: community mesh networks like Freifunk or NYC Mesh
I've used the first one since an example is a 4G network used in the past by my phone many times. I've also used a single-hop, infrastructure-less for connecting bluetooth devices like headphones, phones to the car radio, etc.
## SECTION 7.2
**R3.** Path loss involves the dispersal of a signal in **free space** while multipath propagation refer to the dispersla of the signal by reflection off objects and the ground, taking paths of different lengths between a sender and receiver; and finally in interference from other sources the wireless channel is impaired by sources transmitting in the same frequency like a microwave or a motor.

---
**R4.** 1. Increase the transmission power and 2. Dynamically select the physical-layer modulation technique to adapt the modulation technique to channel conditions.
## SECTION 7.3
**R5.** The beacon frames let devices know which APs are in a "WiFi jungle" by the beacons periodically sent by the APs themselves that include the SSID and MAC address.

---
**R6.** False. It's an optional feature. It _can_ send an RTS frame before transmitting a data frame, especially long ones, but it doesn't *must* to do so.

---
**R7.** Becase it uses CSMA/CD which means a sender knows immediately if a collision occurred and can retransmit. WiFi operates over a shared, noisy, lossy radio medium where collisions can't be detected (only avoided), and frames can be corrupted silently.

---
**R8.** False. 802.11 has *four* address field instead of 2 like 802.3. 1 field for the station that transmits the frame, another for the one receiving it and a third one for the router interface to which the AP is connected so it can access other subnets.

---
**R9** The RTS threshold is an optional configuration that a wireless station can use so that only for frames longer than that said threshold the RTS/CTS is used. For many wireless stations, the default RTS threshold value is larger than the maximum frame length, so the RTS/CTS sequence is skipped for all DATA frames sent.

---
**R10.** No. Their entire point is that they're small in size. If RTS/CTS were full-sized, we'd be transmitting just as much data as the original frame anyway, with added overhead on top.

---
**R11.** To update the outdated entry the switch will have for the moving host. Before moving, the switch has a mapping so that frames going to it must pass for one AP. After the host moves, the frames should be routed via the new AP. This new AP broadcasts an ethernet frame with the moving host's MAC address so that the switch updates its forwarding table.

---
**R12.**

Both control access to the medium, but differently:

- **Bluetooth master**: strictly controls when each device in the piconet transmits, they can only speak when polled. Fully centralized/deterministic.
- **802.11**: doesn't schedule transmissions. Stations contend for the channel independently using CSMA/CA. The AP is more of a relay/bridge than a traffic controller.

---
**R13.** The base station handles:

- **Radio access**: manages the wireless link to devices (scheduling, modulation, power control)
- **Medium access control**: allocates time/frequency resources to devices
- **Handoff coordination**: communicates with neighboring base stations directly  to manage mobility
- **Core network interface**: tunnels user data to the core

In the control plane it directly communicates with the MME while in the data plane to the serving gateway (S-GW).

---
**R14.** The **IMSI** is a globally unique 64-bit identifier that identifies the subscriber in the worldwide cellular carrier network system, including the country and home cellular carrier network to which the subscriber belongs. In some ways, it is analogous to a **MAC address**.

---
**R15.** The role of the HSS is to store information about the mobile devices for which the HSS’s network is their home network. It is used in conjunction with the MME (Mobile Management Entity) for device authentication.

In the control plane it connects to the MME. It's not present in the data plane.

---
**R16.** The role of the MME sets up the tunnels on the data path from/to the device and the PDN Internet gateway router, and maintains information about an active mobile device’s cell location within the carrier’s cellular network.

In the control plane sits in the middle of the network between the base station and the serving gateway, the packet data network gateway and the HSS.

It's not present in the data plane.

---
**R17**

---
**R18.** 
1. **Packet Data Convergence:** uppermost sublayer,  performs IP header/compression in order to decrease the number of bits sent over the wireless link, and encryption/decryption of the IP datagram
2. **Radio Link Control:** it has two functions **(i)** fragmenting (on the sending side) and reassembly (on the receiving) of IP datagrams that are too large to fit  into the underlying link-layer frames, and **(ii)** link-layer reliable data transfer at the through the use of an ACK/NAK-based ARQ protocol
3. **Medium Access Control:** performs transmission scheduling, that is, the requesting and use of the radio transmission slots

---
**R19.** It uses a combination of both known as orthogonal frequency division multiplexing (OFDM). In LTE, each active mobile device is allocated one or more 0.5 ms time slots in one or more of the channel frequencies.

---
**R20.** 
- **Discontinuous reception state**, which is typically entered
after several hundred milliseconds of inactivity
- **The idle state** which follows even longer periods of 5 to 10 seconds of
inactivity, it might be thought of as a “deep sleep” in contrast to the light sleep that the discontinuous recepetion state could be. While in this deep sleep, the mobile device’s radio wakes up and monitors the channel even less frequently.

---
## SECTION 7.5
**R23.** When a device is connected to a cellular network, *other* than its home network.

---
**R24.** It means a transfer of responsibility for forwarding datagrams to/from one AP or base station to the mobile device, as the device moves among WLANs or among LTE cells.

---
**R25.**

In the indirect routing approach, the internet-connected host (correspondent) wishing to connect to a mobile device simply addresses the datagram to the mobile device’s **permanent address** and sends the datagram into the network.

In contrast, in the direct routing approach, the correspondent first discovers the visited network in which the mobile is resident.
This is done by querying the HSS in the mobile device’s home network, assuming (as in the case of indirect routing) that the mobile device’s visited network is registered in the HSS. The correspondent then **tunnels datagrams from its network directly** to the gateway router in the mobile device’s visited network.

---
**R26.** Triangle routing means that datagrams addressed to a certain mobile device must be forwarded first to its home network and then to the visited network, even when a much more efficient route might exist between the correspondent and the roaming mobile device.

---