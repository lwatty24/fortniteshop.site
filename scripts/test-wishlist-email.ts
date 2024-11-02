import { testWishlistAlert } from '../server/lib/test-emails';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    await testWishlistAlert();
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

main(); 