# 💸🌐 DotRelief — Decentralized Crowdfunding on Polkadot

DotRelief is a next-generation decentralized crowdfunding platform built on the Polkadot ecosystem. We enable transparent, low-fee fundraising backed by DAO-based campaign verification, rapid emergency relief, and seamless cross-chain donations.

---

## 🌍 Vision

In an era where trust and speed are critical, DotRelief envisions a world where anyone can launch or support a fundraising campaign with complete transparency, minimal fees, and rapid disbursement. Leveraging Polkadot’s shared security and cross-chain capabilities, we remove barriers between donors and beneficiaries—ensuring that critical funds reach those in need quickly and securely.

---

## 📌 The Problem

Despite advances in crowdfunding, persistent issues remain:

- **High Fees & Slow Settlements:** Traditional and many blockchain-based platforms (e.g., Ethereum) suffer from high gas fees and network congestion, deterring small donations and slowing disbursements.
- **Centralized Verification & Fraud Risk:** Centralized campaign vetting is often opaque, slow, and vulnerable to manipulation.
- **Limited Interoperability:** Most platforms lock donations to a single token or chain, forcing users to bridge assets manually and pay conversion fees.
- **Lack of Emergency Response:** Urgent campaigns (medical, disaster relief) face delays due to lengthy approval processes—delaying critical aid.

---

## 🧠 Our Solution — DotRelief

DotRelief addresses these challenges by delivering:

- **Fully Decentralized & Transparent Workflow:** Every proposal, DAO vote, donation, and payout is recorded on Polkadot’s ledger—fully auditable by anyone.
- **DAO-Based Campaign Verification:** Community staked verifiers (DAO members) review and approve campaigns on-chain, minimizing fraud.
- **Cross-Chain Donations via XCM:** Donors contribute in DOT or any compatible token (e.g., USDT on Kusama), with automatic bridging and minimal friction.
- **RapidResponse Mechanism for Emergencies:** Urgent campaigns can unlock up to 20% of their goal immediately (capped) upon preliminary DAO approval, ensuring fast relief.
- **Low Fees & Fast Finality:** Polkadot’s architecture delivers sub-10-second transaction finality at a fraction of the cost of other blockchains.

---

## 🔥 Key Features

- **DAO Governance & Voting:** Community-driven verification—staked verifiers cast on-chain votes to approve/reject campaigns.
- **Funds Escrow & Automatic Payouts:** Smart contracts hold assets in escrow; funds are released automatically on goal completion.
- **RapidResponse Payouts:** Urgent campaigns flagged by beneficiaries can receive immediate partial disbursement (up to 20% of goal) after a simple majority DAO vote.
- **Cross-Chain Compatibility:** Built on Polkadot XCM—donors can pay with various tokens, automatically bridged and converted.
- **Refund & Reallocation Options:** If a campaign fails to meet its goal, donors can withdraw or reallocate funds to another campaign.
- **Intuitive Frontend Dashboard:** User-friendly UI (Next.js + Tailwind CSS) for browsing, voting, and donating.
- **Off-Chain Data Storage with IPFS:** Campaign metadata (images, docs) stored on IPFS and referenced on-chain via content hashes.
- **Role-Based Access & Security:** Admin multisig functions to pause or freeze operations in emergencies, protecting funds and platform integrity.

---

## 📌 Use Cases

- 🏥 **Medical & Emergency Relief:** Launch urgent medical campaigns with immediate partial funding.
- 🎓 **Education & Scholarships:** Transparent tuition or program crowdfunding.
- 🌱 **Environmental & Social Projects:** DAO-verified legitimacy for impact initiatives.
- 🏢 **Small Business & Startup Funding:** Peer-funded capital for entrepreneurs.
- 🏠 **Disaster Relief & Reconstruction:** RapidResponse ensures immediate grants in disasters.
- 🧑‍⚖️ **Legal & Compliance:** On-chain fundraising for legal defense and advocacy.
- 📸 **Arts & Culture:** Crowdfund exhibitions, albums, or films.

---

## ⚙️ Tech Stack

| Layer                     | Technologies                                                                                             |
|---------------------------|---------------------------------------------------------------------------------------------------------|
| **Frontend**              | Next.js, React.js, Tailwind CSS, TypeScript                                                             |
| **Backend & Database**    | Node.js, Express.js, MongoDB, Redis, RESTful APIs                                                       |
| **Blockchain & Contracts**| Substrate (Parachain), Rust (custom pallets), ink! (smart contracts), Polkadot JS API                   |
| **Cross-Chain Bridge**    | Polkadot XCM (Cross-Consensus Messaging), Bridge Pallets                                                |
| **Storage**               | IPFS (Pinata/Infura), MongoDB GridFS (off-chain metadata caching)                                       |
| **DevOps & Infra**        | Docker, Docker Compose, GitHub Actions CI/CD, AWS/GCP (backend & node hosting)                          |
| **Testing & Audit**       | Substrate’s Rust #[test] framework, Hardhat (EVM-compatible), Third-Party Security Audits               |

---

## 🚀 Get Started

1. **Clone the repo:**  
   ```bash
   git clone https://github.com/your-org/dotrelief.git
   cd dotrelief
   ```

2. **Install dependencies:**  
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. **Configure environment variables:**  
   - See `.env.example` in both `frontend` and `backend` directories.

4. **Run locally:**  
   ```bash
   # Backend
   npm run dev

   # Frontend (in a new terminal)
   npm run dev
   ```

---

## 👨‍💻 Contributing

We welcome contributors! Please open issues and pull requests, and see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🌐 Connect

- [Polkadot](https://polkadot.network/)
- [IPFS](https://ipfs.io/)
- [Next.js](https://nextjs.org/)
- [Substrate](https://substrate.dev/)

> **Empowering relief, transparently—across all chains.**

---
