# DotRelief Frontend Setup

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Getting Your Supabase Environment Variables:

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings → API in your project dashboard
4. Copy your:
   - **Project URL** → use as `VITE_SUPABASE_URL`
   - **anon public key** → use as `VITE_SUPABASE_ANON_KEY`

Example:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Database Tables

The application requires two tables in your Supabase database:

### `fundraises` table:
```sql
CREATE TABLE fundraises (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  donated_amount NUMERIC DEFAULT 0,
  type TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  end_date TIMESTAMPTZ,
  drive_link TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  deployed_contract_address TEXT DEFAULT '',
  wallet_address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `users` table:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT DEFAULT '',
  address TEXT NOT NULL UNIQUE,
  upvoted INTEGER[] DEFAULT '{}',
  created INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

You can create these tables in your Supabase dashboard:
1. Go to Table Editor
2. Create new table
3. Add the columns as specified above

## Contract Address

The application is currently configured to use the deployed contract at:
- **Address**: `0xb0F9338356425FE2ddB3b856239EB2b4a396C1f4`

## Running the Application

1. Install dependencies: `pnpm install`
2. Set up Supabase project and get environment variables
3. Create the required database tables in Supabase
4. Set up environment variables in `.env` file
5. Start the development server: `pnpm dev`
6. Connect your Talisman or MetaMask wallet
7. Start creating fundraise proposals!

## Features

- **Wallet Connection**: Supports Talisman and MetaMask wallets
- **Fundraise Creation**: Create Campaign or Request proposals
- **Blockchain Integration**: Interacts with DotRelief smart contract
- **Database Storage**: Saves proposal details to Supabase PostgreSQL database
- **DAO Voting**: Proposals require DAO member approval 