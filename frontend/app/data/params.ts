export interface ProtocolParam {
  label: string;
  value: string;
}

export const params: ProtocolParam[] = [
  { label: "Min Stream",     value: "10,000 uSTX" },
  { label: "Min Duration",   value: "10 blocks" },
  { label: "Rate",           value: "Per-block linear" },
  { label: "Blocks/Month",   value: "4,320" },
  { label: "Stream Token",   value: "STX" },
  { label: "Protocol Token", value: "RVUS" },
];
