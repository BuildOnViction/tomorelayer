--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Debian 11.3-1.pgdg90+1)
-- Dumped by pg_dump version 11.3 (Debian 11.3-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: root
--



--
-- Data for Name: contract; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.contract (id, name, owner, address, abi, obsolete) VALUES (4, 'RelayerRegistration', '0xd09d5eac0842208c551c89a48a7ed9867c61faf4', '0xA1996F69f47ba14Cb7f661010A7C31974277958c', '[{"name": "buyRelayer", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}], "outputs": [], "payable": true, "constant": false, "stateMutability": "payable"}, {"name": "cancelSelling", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}], "outputs": [], "payable": false, "constant": false, "stateMutability": "nonpayable"}, {"name": "depositMore", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}], "outputs": [], "payable": true, "constant": false, "stateMutability": "payable"}, {"name": "reconfigure", "type": "function", "inputs": [{"name": "maxRelayer", "type": "uint256"}, {"name": "maxToken", "type": "uint256"}, {"name": "minDeposit", "type": "uint256"}], "outputs": [], "payable": false, "constant": false, "stateMutability": "nonpayable"}, {"name": "refund", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}], "outputs": [], "payable": false, "constant": false, "stateMutability": "nonpayable"}, {"name": "register", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}, {"name": "tradeFee", "type": "uint16"}, {"name": "fromTokens", "type": "address[]"}, {"name": "toTokens", "type": "address[]"}], "outputs": [], "payable": true, "constant": false, "stateMutability": "payable"}, {"name": "resign", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}], "outputs": [], "payable": false, "constant": false, "stateMutability": "nonpayable"}, {"name": "sellRelayer", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}, {"name": "price", "type": "uint256"}], "outputs": [], "payable": false, "constant": false, "stateMutability": "nonpayable"}, {"name": "transfer", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}, {"name": "new_owner", "type": "address"}], "outputs": [], "payable": false, "constant": false, "stateMutability": "nonpayable"}, {"name": "update", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}, {"name": "tradeFee", "type": "uint16"}, {"name": "fromTokens", "type": "address[]"}, {"name": "toTokens", "type": "address[]"}], "outputs": [], "payable": false, "constant": false, "stateMutability": "nonpayable"}, {"type": "constructor", "inputs": [{"name": "maxRelayers", "type": "uint256"}, {"name": "maxTokenList", "type": "uint256"}, {"name": "minDeposit", "type": "uint256"}], "payable": false, "stateMutability": "nonpayable"}, {"name": "ConfigEvent", "type": "event", "inputs": [{"name": "max_relayer", "type": "uint256", "indexed": false}, {"name": "max_token", "type": "uint256", "indexed": false}, {"name": "min_deposit", "type": "uint256", "indexed": false}], "anonymous": false}, {"name": "RegisterEvent", "type": "event", "inputs": [{"name": "deposit", "type": "uint256", "indexed": false}, {"name": "tradeFee", "type": "uint16", "indexed": false}, {"name": "fromTokens", "type": "address[]", "indexed": false}, {"name": "toTokens", "type": "address[]", "indexed": false}], "anonymous": false}, {"name": "UpdateEvent", "type": "event", "inputs": [{"name": "deposit", "type": "uint256", "indexed": false}, {"name": "tradeFee", "type": "uint16", "indexed": false}, {"name": "fromTokens", "type": "address[]", "indexed": false}, {"name": "toTokens", "type": "address[]", "indexed": false}], "anonymous": false}, {"name": "TransferEvent", "type": "event", "inputs": [{"name": "owner", "type": "address", "indexed": false}, {"name": "deposit", "type": "uint256", "indexed": false}, {"name": "tradeFee", "type": "uint16", "indexed": false}, {"name": "fromTokens", "type": "address[]", "indexed": false}, {"name": "toTokens", "type": "address[]", "indexed": false}], "anonymous": false}, {"name": "ResignEvent", "type": "event", "inputs": [{"name": "deposit_release_time", "type": "uint256", "indexed": false}, {"name": "deposit_amount", "type": "uint256", "indexed": false}], "anonymous": false}, {"name": "RefundEvent", "type": "event", "inputs": [{"name": "success", "type": "bool", "indexed": false}, {"name": "remaining_time", "type": "uint256", "indexed": false}, {"name": "deposit_amount", "type": "uint256", "indexed": false}], "anonymous": false}, {"name": "SellEvent", "type": "event", "inputs": [{"name": "is_on_sale", "type": "bool", "indexed": false}, {"name": "coinbase", "type": "address", "indexed": false}, {"name": "price", "type": "uint256", "indexed": false}], "anonymous": false}, {"name": "BuyEvent", "type": "event", "inputs": [{"name": "success", "type": "bool", "indexed": false}, {"name": "coinbase", "type": "address", "indexed": false}, {"name": "price", "type": "uint256", "indexed": false}], "anonymous": false}, {"name": "CONTRACT_OWNER", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "address"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "getRelayerByCoinbase", "type": "function", "inputs": [{"name": "coinbase", "type": "address"}], "outputs": [{"name": "", "type": "uint256"}, {"name": "", "type": "address"}, {"name": "", "type": "uint256"}, {"name": "", "type": "uint16"}, {"name": "", "type": "address[]"}, {"name": "", "type": "address[]"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "MaximumRelayers", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "uint256"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "MaximumTokenList", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "uint256"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "MinimumDeposit", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "uint256"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "RELAYER_COINBASES", "type": "function", "inputs": [{"name": "", "type": "uint256"}], "outputs": [{"name": "", "type": "address"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "RELAYER_ON_SALE_LIST", "type": "function", "inputs": [{"name": "", "type": "address"}], "outputs": [{"name": "", "type": "uint256"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "RelayerCount", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "uint256"}], "payable": false, "constant": true, "stateMutability": "view"}]', false);
INSERT INTO public.contract (id, name, owner, address, abi, obsolete) VALUES (3, 'TOMOXListing', 'empty', '0x14B2Bf043b9c31827A472CE4F94294fE9a6277e0', '[{"name": "tokens", "type": "function", "inputs": [], "outputs": [{"name": "", "type": "address[]"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "getTokenStatus", "type": "function", "inputs": [{"name": "token", "type": "address"}], "outputs": [{"name": "", "type": "bool"}], "payable": false, "constant": true, "stateMutability": "view"}, {"name": "apply", "type": "function", "inputs": [{"name": "token", "type": "address"}], "outputs": [], "payable": true, "constant": false, "stateMutability": "payable"}]', false);


--
-- Data for Name: relayer; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.relayer (id, owner, name, coinbase, deposit, trade_fee, from_tokens, to_tokens, logo, link, resigning, lock_time) VALUES (1, '0xd09d5eac0842208c551c89a48a7ed9867c61faf4', 'TomoDex', '0x5DCFb4Dc28FBdD2b21af9138E94f5316f5EE6bC9', '24823910000000000000000', 1, '{0x0000000000000000000000000000000000000001,0x0000000000000000000000000000000000000001,0x28d7fC2Cf5c18203aaCD7459EFC6Af0643C97bE8,0x11c2cAF973db997b8a9b5689b33962E1AedEA968,0x11c2cAF973db997b8a9b5689b33962E1AedEA968,0x11c2cAF973db997b8a9b5689b33962E1AedEA968}', '{0x28d7fC2Cf5c18203aaCD7459EFC6Af0643C97bE8,0x300cF046db91265B616DD134899ba150835dB488,0x300cF046db91265B616DD134899ba150835dB488,0x28d7fC2Cf5c18203aaCD7459EFC6Af0643C97bE8,0x0000000000000000000000000000000000000001,0x300cF046db91265B616DD134899ba150835dB488}', 'https://www.lunapic.com/editor/premade/transparent.gif', 'http://localhost:3001', false, 1583823390);


--
-- Data for Name: token; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public.token (id, name, symbol, logo, address, total_supply, is_major) VALUES (1, 'Bitcoin', 'BTC', NULL, '0x28d7fC2Cf5c18203aaCD7459EFC6Af0643C97bE8', '1000000000000000000000000000000', true);
INSERT INTO public.token (id, name, symbol, logo, address, total_supply, is_major) VALUES (2, 'Ethereum', 'ETH', NULL, '0x11c2cAF973db997b8a9b5689b33962E1AedEA968', '1000000000000000000000000000000', false);
INSERT INTO public.token (id, name, symbol, logo, address, total_supply, is_major) VALUES (3, 'TomoChain', 'TOMO', NULL, '0x0000000000000000000000000000000000000001', '1000000000000000000000000000000', true);
INSERT INTO public.token (id, name, symbol, logo, address, total_supply, is_major) VALUES (9, 'Tether', 'USDT', NULL, '0x300cF046db91265B616DD134899ba150835dB488', '1000000000000000000000000000000', true);


--
-- Name: admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.admin_id_seq', 1, false);


--
-- Name: contract_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.contract_id_seq', 3, true);


--
-- Name: relayer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.relayer_id_seq', 15, true);


--
-- Name: token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.token_id_seq', 28, true);


--
-- PostgreSQL database dump complete
--

