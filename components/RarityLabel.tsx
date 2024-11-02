interface RarityLabelProps {
  rarity: string;
  gradient: string;
}

export function RarityLabel({ rarity, gradient }: RarityLabelProps) {
  return (
    <span className={`px-2 py-1 rounded-lg font-medium bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
      {rarity}
    </span>
  );
} 