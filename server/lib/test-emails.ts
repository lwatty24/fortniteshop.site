import { sendItemAlert } from './email';

export async function testWishlistAlert() {
  const testItems = [
    {
      name: "Renegade Raider",
      image: "https://fortnite-api.com/images/cosmetics/br/CID_028_Athena_Commando_F/icon.png",
      price: 1200,
      type: "Outfit",
      rarity: "Rare"
    },
    {
      name: "Raiders Revenge",
      image: "https://fortnite-api.com/images/cosmetics/br/Pickaxe_ID_011_Raiders_Revenge/icon.png",
      price: 1500,
      type: "Harvesting Tool",
      rarity: "Epic"
    },
    {
      name: "Aerial Assault Trooper",
      image: "https://fortnite-api.com/images/cosmetics/br/CID_017_Athena_Commando_M/icon.png",
      price: 1200,
      type: "Outfit",
      rarity: "Rare"
    }
  ];

  try {
    const testEmail = "leon.waterson2006@gmail.com";
    
    console.log('🧪 Testing wishlist alert email...');
    console.log('📧 Sending to:', testEmail);
    console.log('🎮 Testing with items:', testItems.map(item => item.name).join(', '));

    const result = await sendItemAlert(testEmail, testItems);
    
    console.log('\n✅ Test email sent successfully!');
    console.log(`📝 Message ID: ${result.data.id}`);
    
    return result;
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    throw error;
  }
} 