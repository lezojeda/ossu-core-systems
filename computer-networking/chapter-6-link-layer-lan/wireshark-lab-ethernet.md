```
No.  Time               Source                    Destination              Protocol Length Info
4    20:43:10,822016700 LiteonTechno_7d:70:79     SagemcomBroa_e9:fc:47   0x0800   266    IPv4

Frame 4: Packet, 266 bytes on wire (2128 bits), 266 bytes captured (2128 bits)
Interface: \Device\NPF_{F20C0879-68C4-4DDF-8A8F-02CFF3A3458D}

Encapsulation type: Ethernet (1)

Arrival Time: Apr 28, 2026 20:43:10.822016700 (Argentina)
UTC Arrival Time: Apr 28, 2026 23:43:10.822016700 UTC
Epoch Arrival Time: 1777419790.822016700

Frame Number: 4
Frame Length: 266 bytes
Capture Length: 266 bytes

Protocols in frame: eth:ethertype:data

Ethernet II:
  Destination: SagemcomBroa_e9:fc:47 (38:a6:59:e9:fc:47)
  Source:      LiteonTechno_7d:70:79 (e0:0a:f6:7d:70:79)
  Type:        IPv4 (0x0800)

Data (252 bytes):

0000  45 00 00 fc 59 48 40 00 80 06 1d 54 c0 a8 01 0e
0010  c0 a8 01 01 ce 28 c0 00 19 57 0f dd d0 69 cc c7
0020  50 18 00 ff 51 9c 00 00 47 45 54 20 2f 37 35 33
0030  39 36 36 34 35 2f 77 61 6e 63 6f 6d 69 63 66 67
0040  53 43 50 44 2e 78 6d 6c 20 48 54 54 50 2f 31 2e
0050  31 0d 0a 43 61 63 68 65 2d 43 6f 6e 74 72 6f 6c
0060  3a 20 6e 6f 2d 63 61 63 68 65 0d 0a 43 6f 6e 6e
0070  65 63 74 69 6f 6e 3a 20 43 6c 6f 73 65 0d 0a 50
0080  72 61 67 6d 61 3a 20 6e 6f 2d 63 61 63 68 65 0d
0090  0a 41 63 63 65 70 74 3a 20 74 65 78 74 2f 78 6d
00a0  6c 2c 20 61 70 70 6c 69 63 61 74 69 6f 6e 2f 78
00b0  6d 6c 0d 0a 55 73 65 72 2d 41 67 65 6e 74 3a 20
00c0  4d 69 63 72 6f 73 6f 66 74 2d 57 69 6e 64 6f 77
00d0  73 2f 31 30 2e 30 20 55 50 6e 50 2f 31 2e 30 0d
00e0  0a 48 6f 73 74 3a 20 31 39 32 2e 31 36 38 2e 31
00f0  2e 31 3a 34 39 31 35 32 0d 0a 0d 0a
```
1. e0:0a:f6:7d:70:79
2. 38:a6:59:e9:fc:47. No, it's the ethernet address of my home's router network interface.
3. 0x0800 -> IPv4
4. Unos 53 bytes![[get_eth_frame.png]]
	Ethernet: 14 bytes
	IP: 20 bytes
	TCP: 20 bytes
	HTTP: 212 bytes

---
### Ethernet frame containing the first byte of the HTTP response message:
```
No.   Time                  Source                Destination           Protocol Length  Info
296   20:43:12,289434900    SagemcomBroa_e9:fc:47 LiteonTechno_7d:70:79 0x0800    1506    IPv4

Frame 296: Packet, 1506 bytes on wire (12048 bits), 1506 bytes captured (12048 bits) on interface
\Device\NPF_{F20C0879-68C4-4DDF-8A8F-02CFF3A3458D}, id 0
Ethernet II, Src: SagemcomBroa_e9:fc:47 (38:a6:59:e9:fc:47), Dst: LiteonTechno_7d:70:79 (e0:0a:f6:7d:70:79)
Data (1492 bytes)

0000  45 00 05 d4 1c 7e 40 00  2c 06 f5 6b 80 77 f5 0c  E....~@.,..k.w..
0010  c0 a8 01 0e 00 50 e0 4d  85 a7 4e a5 4a 59 3b 0b  .....P.M..N.JY;.
0020  50 10 01 f5 b6 b7 00 00  48 54 54 50 2f 31 2e 31  P.......HTTP/1.1

[...]
```
5. Source: 38:a6:59:e9:fc:47. It's the address of my router.
6. Destination: e0:0a:f6:7d:70:79. The destination MAC address corresponds to my computer's WiFi network adapter. Although my computer had multiple network interfaces with different MAC addresses, this frame was captured on the WiFi interface and its destination address matches that specific adapter.
7. 0x0800 -> IPv4
8. The byte 0x4f which contains the OK is the 67th byte counting from 0.

## ARP
```
  Dirección de Internet    Dirección física      Tipo
  192.168.1.1              38-a6-59-e9-fc-47     dinámico
  192.168.1.3              ec-b5-fa-8e-cb-52     dinámico
```
9. First column has the IP address to which the physical/MAC address in the second columns matches. The dynamic type means that the entry was learnt automatically by the ARP instead of static which would've meant that it was manually added. At some point, this computer sent an ARP request to determine the physical address of each IP address and after a successful response it stored the values.

### ARP request
```
No.   Time                  Source                Destination  Protocol  Length  Info
220   12:33:43,378552800    LiteonTechno_7d:70:79 Broadcast    ARP       42      Who has 192.168.1.11? Tell 192.168.1.14

Frame 220: 42 bytes on wire (336 bits), 42 bytes captured (336 bits)
Interface: \Device\NPF_{F20C0879-68C4-4DDF-8A8F-02CFF3A3458D}, id 0
Ethernet II, Src: LiteonTechno_7d:70:79 (e0:0a:f6:7d:70:79), Dst: Broadcast (ff:ff:ff:ff:ff:ff)
Address Resolution Protocol (request)
```
10. Src: e0:0a:f6:7d:70:79 (the WiFi adapter of my laptop). Dst: ff:ff:ff:ff:ff:ff (MAC broadcast address)
11. 0x0806 ARP, the EtherType used in Ethernet to identify ARP frames
12. 
	a) 20 bytes
	b) 00 01 -> which indicates it's an ARP **request**
	c) Yes, in bytes 28-31
	d) In the combination of the target MAC address and IP address. The first is the broadcast one and second the IP address we want to know the MAC address for (192.168.1.11 here, another device in my LAN).
### ARP reply
```
No.   Time                  Source                    Destination           Protocol  Length  Info
224   12:33:43,476492700    FNLINKTECHNO_f6:6b:24     LiteonTechno_7d:70:79 ARP       52      192.168.1.11 is at e8:5c:5f:f6:6b:24

Frame 224: 52 bytes on wire (416 bits), 52 bytes captured (416 bits)
Interface: \Device\NPF_{F20C0879-68C4-4DDF-8A8F-02CFF3A3458D}, id 0
Ethernet II, Src: FNLINKTECHNO_f6:6b:24 (e8:5c:5f:f6:6b:24), Dst: LiteonTechno_7d:70:79 (e0:0a:f6:7d:70:79)

Address Resolution Protocol (reply)
  Hardware type: Ethernet (1)
  Protocol type: IPv4 (0x0800)
  Hardware size: 6
  Protocol size: 4
  Opcode: reply (2)
  Sender MAC address: FNLINKTECHNO_f6:6b:24 (e8:5c:5f:f6:6b:24)
  Sender IP address: 192.168.1.11
  Target MAC address: LiteonTechno_7d:70:79 (e0:0a:f6:7d:70:79)
  Target IP address: 192.168.1.14
```
13. 
    a) 20 bytes
    b) 0010 (2) -> which indicates it's an ARP **reply**
    c) In the combination of the MAC address (which is not a broadcast one now) and the IP address (matching the one in the ARP request target ip address field).
14. Source: corresponds to the adapter connected to the same network with the requested IP, e8:5c:5f:f6:6b:24. Destination: same but for the initial requester.