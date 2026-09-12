export type MemeCard = {
  id: string;
  stamp: string;
  src: string;
  file: string;
  alt: string;
  caption: string;
};

export const memes: MemeCard[] = [
  {
    id: "cto",
    stamp: "01",
    src: "/mascot.jpg",
    file: "pump-cto.jpg",
    alt: "Pump token mark for the community takeover",
    caption: "Dev left. Community stayed. $Pump is a CTO.",
  },
  {
    id: "tax",
    stamp: "02",
    src: "/mascot.jpg",
    file: "pump-tax.jpg",
    alt: "Pump token mark for the 3 percent holder tax",
    caption: "3% tax. Paid back to holders in PUMP.",
  },
  {
    id: "ca",
    stamp: "03",
    src: "/mascot.jpg",
    file: "pump-ca.jpg",
    alt: "Pump token mark with the contract address",
    caption: "CA: BXfQckZtKu4oA3s5d8qmTHkkkVcULv9JyzKwD2YPpump",
  },
  {
    id: "hold",
    stamp: "04",
    src: "/mascot.jpg",
    file: "pump-hold.jpg",
    alt: "Pump token mark for holding rewards",
    caption: "Hold $Pump. Get paid in PUMP. Nobody is coming to save it.",
  },
];
