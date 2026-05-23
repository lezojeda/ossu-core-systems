## Beacon Frames
1. "30 Munroe St" and "linksys_ses_24086" as seen in the SSID Parameter set tag of the beacon frames' payloads.
2. 0.102400 seconds, 102.4 miliseconds (100 time units)
3. 00:16:b6:f7:1d:51
4. The broadcast MAC address ff:ff:ff:ff:ff:ff
5. 00:16:b6:f7:1d:51, the same as the source
6. These are the data rates supported by the access point. All of them are mandatory for stations joining that network. Clients must be able to receive and usually transmit using those rates.
## Data Transfer
7. Destination address: 00:16:b6:f4:eb:a8, BSS Id address: 00:16:b6:f7:1d:51 and Source address: 00:13:02:d1:b6:4f.
   
   The address of the wireless host is that of the transmitter/source. The access point corresponds to the BSS Id address. The first hop router the destination address.
   
   The IP address of the wireless host is 192.168.1.109 as seen in the IP datagram. The destination IP 128.119.245.12. It corresponds to the first-hop router, the AP is a layer 2 device, it doesn't understand the IP protocol.
8. Destination address: 91:2a:b0:49:b6:4f, BSS Id address: 00:16:b6:f7:1d:51 and Source address: 00:16:b6:f4:eb:a8. Host: destination, access point: BSS Id and first-hop router: source.
   
   No, they don't match because MAC addresses are used per-hop while IP addressing is for end-to-end routing.
## Association/Disassociation
9. A frame of type `Deauthentication` is sent to the AP, this is the 802.11 action. The IP-layer action is a DHCP packet with the Message type set to 7 which corresponds to a request for release, i.e. the host telling the DHCP server that it's giving up its IP address.