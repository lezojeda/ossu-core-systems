1. 192.168.1.102, 192.168.1.11 when I finally could get a trace to work from my own machine
2. ICMP
3. Header length = 20 bytes, payload length = 64 bytes. The payload is determined by finding the total length field and subtracting the header length from it.
4. No. I could tell by checking the "More fragments" section of the Flags field which was set to 0
5. The Header Checksum and Identification fields which makes sense since together let's uniquely identifiy each datagram.
6. The Header Length, Total Length, Protocol, Source and Destination addresses. These field stay constant since they come from the `traceroute` command and the destination address is the host we're interested to track, it shouldn't change.
7. They increase by 1
8. The identification field varies but the TTL is constant for a give source address.
9. Yes (mostly), they remain unchanged — specifically the TTL remains constant, while the Identification field does not.
10. Yes, the datagrams were fragmented into two: one of 1514 bytes and a second one of 534. Both with the same identification field.
11. The `More fragments: Set` flag. And also the fact that the length was lower than the size we used in the `traceroute` command (2000 vs 1500). Whether this is the first fragment or a latter one is indicated by the offset, since it's 0 here it means it is the first one (the second fragment had an offset of 1480). The fragment is 1500 bytes long which makes sense since the MTU (Maximum Transmission Unit) of the WiFi interface used was 1500.
12. The offset value of 1480. There are no more fragments since `More fragments` flag is set to 0.
13. The fields that change are the `More fragments` of the `Flags` field, the `Total Length` and the `Header Checksum`.

```
Frame 31: Packet, 1514 bytes on wire (12112 bits), 1514 bytes captured (12112 bits) on interface wlp2s0, id 0

Ethernet II, Src: FNLINKTECHNO_f6:6b:24 (e8:5c:5f:f6:6b:24), Dst: SagemcomBroa_e9:fc:47 (38:a6:59:e9:fc:47)

Internet Protocol Version 4
    Src: 192.168.1.11, Dst: 128.119.245.12
    Version: 4
    Header Length: 20 bytes (5)
    Differentiated Services Field: 0x00 (DSCP: CS0, ECN: Not-ECT)
    Total Length: 1500
    Identification: 0x09f6 (2550)
    Flags: 0x1, More fragments
        - Don't fragment: Not set
        - More fragments: Set
    Fragment Offset: 0
    Time to Live: 1
    Protocol: ICMP (1)
    Header Checksum: 0x52f4 [validation disabled]

Internet Control Message Protocol
    Type: Echo (ping) request (8)
    Code: 0
    Checksum: 0x6a96 [unverified] [fragmented datagram]
    Identifier (BE): 5 (0x0005)
    Sequence Number (BE): 1 (0x0001)
    [No response seen]

Data (1472 bytes)
    0000  48 49 4a 4b 4c 4d 4e 4f 50 51 52 53 54 55 56 57   HIJKLMNOPQRSTUVW
    0010  58 59 5a 5b 5c 5d 5e 5f 60 61 62 63 64 65 66 67   XYZ[\]^_`abcdefg
    0020  68 69 6a 6b 6c 6d 6e 6f 70 71 72 73 74 75 76 77   hijklmnopqrstuvw
    0030  78 79 7a 7b 7c 7d 7e 7f 40 41 42 43 44 45 46 47   xyz{|}~.@ABCDEFG
    0040  48 49 4a 4b 4c 4d 4e 4f 50 51 52 53 54 55 56 57   HIJKLMNOPQRSTUVW
...
[Length: 1472]
```