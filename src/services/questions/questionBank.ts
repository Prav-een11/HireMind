import { StructuredQuestion } from './types';

export const REALISTIC_QUESTION_BANK: StructuredQuestion[] = [
  // ==========================================
  // 1. SOFTWARE DEVELOPER - FRESHER (ENTRY-LEVEL)
  // ==========================================
  {
    id: 'sd-fresher-dsa-1',
    jobRole: 'Software Developer',
    experienceLevel: 'Fresher',
    interviewType: 'Technical',
    topic: 'Data Structures & Algorithms',
    subtopic: 'Arrays & Hash Maps',
    difficulty: 'Easy',
    category: 'Coding & Algorithmic Reasoning',
    question: 'You are given an array of integers and a target value. You need to find and return the indices of two distinct elements whose sum equals the target. Explain a brute-force approach first, optimize it using an appropriate data structure, and analyze the time and space complexity of both approaches.',
    expectedCompetencies: ['Algorithmic trade-offs', 'Hash map lookups', 'Time & space complexity analysis (Big-O)', 'Edge case reasoning'],
    expectedDepth: '60–120 seconds: explain nested loop O(N²) vs hash map complement lookup O(N) with O(N) space, handling duplicate values.',
    evaluationRubric: {
      technicalAccuracy: 'Correctly distinguishes O(N²) brute force from O(N) single-pass hash map complement lookup.',
      relevance: 'Directly addresses both brute-force and optimized solutions without irrelevant tangents.',
      completeness: 'Mentions time and space complexities for both approaches and discusses edge cases (e.g. duplicate elements, no solution).',
      clarity: 'Explains logic step-by-step in structured verbal/written flow.',
      problemSolving: 'Demonstrates clear transition from naive searching to space-time trade-off optimization.',
      communication: 'Uses precise computer science terminology (lookup time, amortized O(1), complement).'
    },
    idealAnswer: 'The brute-force approach uses two nested loops to check all pairs (i, j), running in O(N²) time and O(1) space. We can optimize this to O(N) time using a hash map. In a single pass, for each element num at index i, we calculate its complement (target - num). If the complement is already in the map, we return [map[complement], i]. Otherwise, we record map[num] = i. This achieves O(N) time complexity with O(N) auxiliary space, and naturally handles duplicate numbers because we look up before inserting.',
    followUpObjectives: 'Probe edge case handling when numbers appear multiple times or when input array is sorted.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'If the input array is already sorted in ascending order, how would you solve this with O(1) auxiliary space without using a hash map?',
        objective: 'Test two-pointer technique on sorted arrays.',
        difficulty: 'Medium',
      },
      {
        triggerCondition: 'low_score',
        question: 'Walk through an example with nums = [3, 2, 4] and target = 6 step-by-step with the hash map.',
        objective: 'Test basic dry-run ability and complement lookup logic.',
        difficulty: 'Easy',
      }
    ]
  },
  {
    id: 'sd-fresher-os-1',
    jobRole: 'Software Developer',
    experienceLevel: 'Fresher',
    interviewType: 'Technical',
    topic: 'Operating Systems',
    subtopic: 'Concurrency & Race Conditions',
    difficulty: 'Medium',
    category: 'Conceptual with Practical Application',
    question: 'Two threads concurrently update a shared bank account balance by executing `balance = balance + depositAmount`. Explain how a race condition can occur at the assembly/instruction level, demonstrate a concrete failure scenario, and compare two synchronization mechanisms to prevent it.',
    expectedCompetencies: ['Thread memory model', 'Atomic operations vs read-modify-write', 'Mutexes vs Semaphores/Atomic primitives', 'Concurrency bug diagnosis'],
    expectedDepth: '1–2 minutes: break down read-modify-write instructions, show interleaved execution losing an update, and explain mutex locks vs atomic variables.',
    evaluationRubric: {
      technicalAccuracy: 'Accurately explains that balance increment consists of three CPU instructions: load, add, store.',
      relevance: 'Directly addresses instruction-level race condition, gives a failure sequence, and compares synchronization.',
      completeness: 'Details an interleaved execution timeline and compares mutexes (locks) with atomic operations or semaphores.',
      clarity: 'Presents the interleaved timeline in clear chronological order.',
      problemSolving: 'Understands why high-level single lines are non-atomic at hardware/OS level.',
      communication: 'Uses crisp concurrency terms (preemption, critical section, mutual exclusion, lost update).'
    },
    idealAnswer: 'At the CPU level, `balance += amount` decomposes into three steps: LOAD balance from memory into register, ADD amount, and STORE register back to memory. If Thread A loads balance (say $100) and is preempted before storing, Thread B runs and completes its increment (reading $100, adding $50, storing $150). When Thread A resumes, its register still holds $100; it adds $20 and stores $120, completely overwriting Thread B\'s update (a lost update bug). To prevent this, we can protect the critical section with a Mutex (mutual exclusion lock) ensuring only one thread executes the section at a time, or use hardware-supported Atomic instructions (e.g., atomic compare-and-swap or atomic fetch-and-add) which avoid locking overhead for single primitives.',
    followUpObjectives: 'Probe understanding of deadlock or performance trade-offs of locking.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'What performance problems can arise if we synchronize the entire method using a coarse-grained mutex lock when thousands of threads are calling it?',
        objective: 'Test lock contention, throughput bottlenecks, and lock granularity.',
        difficulty: 'Medium',
      }
    ]
  },
  {
    id: 'sd-fresher-db-1',
    jobRole: 'Software Developer',
    experienceLevel: 'Fresher',
    interviewType: 'Technical',
    topic: 'DBMS & SQL',
    subtopic: 'Indexing & Query Optimization',
    difficulty: 'Medium',
    category: 'SQL & Database Problem Solving',
    question: 'You have an `Employees` table with columns `id`, `name`, `department_id`, and `salary`. Write an SQL query to find the second-highest distinct salary in each department. Explain how your solution handles edge cases such as duplicate salaries, departments with fewer than two employees, and NULL values.',
    expectedCompetencies: ['Window functions (DENSE_RANK)', 'Handling ties and distinct values', 'Subquery reasoning', 'Null & edge-case handling in SQL'],
    expectedDepth: '1–2 minutes: provide query using DENSE_RANK() or correlated subquery, explain why DENSE_RANK handles ties while ROW_NUMBER does not, and discuss departments with only 1 employee.',
    evaluationRubric: {
      technicalAccuracy: 'Correctly identifies that DENSE_RANK() over (PARTITION BY department_id ORDER BY salary DESC) handles duplicate salary ties.',
      relevance: 'Provides complete SQL and directly addresses the edge case criteria.',
      completeness: 'Covers duplicate salaries, departments with < 2 employees (they produce no row or NULL depending on outer query), and NULL handling.',
      clarity: 'Structured explanation of the query partitions and filtering.',
      problemSolving: 'Chooses the right SQL pattern (Window CTE vs subquery) and explains trade-offs.',
      communication: 'Accurate SQL syntax and windowing terminology.'
    },
    idealAnswer: 'Using a Common Table Expression (CTE) with DENSE_RANK:\nWITH RankedSalaries AS (\n  SELECT department_id, salary,\n         DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk\n  FROM Employees\n  WHERE salary IS NOT NULL\n)\nSELECT department_id, salary\nFROM RankedSalaries\nWHERE rnk = 2;\n\nDENSE_RANK is vital here: if the top salaries are $100k, $100k, and $90k, both $100k earn rank 1, and $90k receives rank 2. ROW_NUMBER would incorrectly assign rank 2 to the second $100k employee. Filtering WHERE salary IS NOT NULL upfront prevents NULL values from skewing the rank. If a department has fewer than two distinct salaries, it simply yields no result for rank = 2.',
    followUpObjectives: 'Probe difference between DENSE_RANK, RANK, and ROW_NUMBER.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'What index would you create on the Employees table to optimize this query for millions of rows?',
        objective: 'Test composite indexing (department_id, salary DESC).',
        difficulty: 'Medium',
      }
    ]
  },
  {
    id: 'sd-fresher-net-1',
    jobRole: 'Software Developer',
    experienceLevel: 'Fresher',
    interviewType: 'Technical',
    topic: 'Computer Networks',
    subtopic: 'DNS & HTTP Troubleshooting',
    difficulty: 'Medium',
    category: 'Debugging & Root-Cause Analysis',
    question: 'A user reports that a company internal web portal loads normally when entered using its direct IP address (e.g. `http://192.168.1.50:8080`), but fails to resolve with "Host Not Found" when accessed via its domain name (e.g. `http://portal.company.internal:8080`). Describe your systematic debugging process, identify 3 possible root causes, and explain how you would isolate and fix the issue.',
    expectedCompetencies: ['DNS resolution lifecycle', 'Command-line diagnostic tools (nslookup, dig, ping, traceroute)', 'Local hosts file vs DNS servers', 'Systematic debugging methodology'],
    expectedDepth: '1–2 minutes: step-by-step isolation from client machine to local DNS cache, router/DNS server, and domain records.',
    evaluationRubric: {
      technicalAccuracy: 'Accurately recognizes this as a DNS resolution failure since IP access succeeds.',
      relevance: 'Focuses on network name resolution rather than web server application bugs.',
      completeness: 'Names specific diagnostic commands (nslookup, dig, ping) and lists 3 plausible root causes (missing DNS A-record, stale local DNS cache, misconfigured DNS resolver/DHCP).',
      clarity: 'Logical sequence: client verification -> local cache -> upstream DNS server -> records.',
      problemSolving: 'Demonstrates methodical isolation instead of random guessing.',
      communication: 'Professional network and diagnostic terminology.'
    },
    idealAnswer: 'Since direct IP access works, the web server, port, and network routing are functioning; the failure is strictly isolated to DNS name resolution. My debugging steps would be: 1) Run `nslookup portal.company.internal` or `dig` from the client to see what IP the configured DNS resolver returns. 2) Check the client\'s `/etc/resolv.conf` or network adapter settings to verify which DNS server is being queried. 3) Test if flushing the local DNS cache (`ipconfig /flushdns` or `systemd-resolve --flush-caches`) resolves stale records. The three most likely root causes are: A) Missing or misconfigured \'A\' or \'CNAME\' record on the internal DNS server. B) The client machine is using a public DNS resolver (like 8.8.8.8) via DHCP instead of the internal company DNS server. C) An outdated entry in the client\'s local hosts file overriding resolution.',
    followUpObjectives: 'Test understanding of TTL, CNAME vs A records, or HTTPS SNI implications.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'If the portal used HTTPS with TLS, would navigating directly to the IP address succeed without warnings? Why or why not?',
        objective: 'Test SSL/TLS certificate domain validation (Subject Alternative Names).',
        difficulty: 'Medium',
      }
    ]
  },
  {
    id: 'sd-fresher-py-1',
    jobRole: 'Software Developer',
    experienceLevel: 'Fresher',
    interviewType: 'Technical',
    topic: 'Python & Software Engineering',
    subtopic: 'Data Deduplication & Memory Management',
    difficulty: 'Medium',
    category: 'Conceptual with Practical Application',
    question: 'You are processing a dataset containing several million records represented as a list of items. You need to remove duplicates while strictly preserving their original insertion order. How would you implement this in Python? Explain the time and space complexity, and describe how you would handle records that contain unhashable types (such as nested dictionaries or lists).',
    expectedCompetencies: ['Python data structures (dict, set, list)', 'Hashability & __hash__ / __eq__ requirements', 'Preserving insertion order (Python 3.7+ dict behavior)', 'Handling unhashable nested structures'],
    expectedDepth: '60–120 seconds: explain `dict.fromkeys()` / set with seen tracker for O(N), explain unhashable types and serializing or converting to tuples.',
    evaluationRubric: {
      technicalAccuracy: 'Recognizes that Python 3.7+ dicts preserve insertion order (`list(dict.fromkeys(items))` or set seen tracker). Correctly explains hashability requirements.',
      relevance: 'Directly solves deduplication, order preservation, complexity, and unhashable handling.',
      completeness: 'Covers O(N) time and space, and explains converting unhashable dicts/lists to JSON strings or frozen types/tuples.',
      clarity: 'Clean step-by-step logic and clear complexity explanations.',
      problemSolving: 'Practical reasoning on memory implications for millions of records.',
      communication: 'Uses exact Python mechanics (hashable, immutable, dict key uniqueness).'
    },
    idealAnswer: 'For hashable items in Python 3.7+, `list(dict.fromkeys(items))` deduplicates in O(N) time and O(N) space while strictly preserving insertion order because dictionaries maintain insertion order and reject duplicate keys. Alternatively, iterating with a `seen = set()` and appending new items to a result list also runs in O(N). For records with unhashable types (e.g., dicts or lists), standard hashing raises a TypeError. To handle them: 1) If the objects are nested dictionaries or lists, we can serialize each record to a canonical JSON string (with sorted keys) or recursively convert nested dicts to frozensets/tuples before checking the `seen` set. 2) For large datasets with millions of records, instead of holding all objects in memory at once, we can stream chunks using a generator, hashing records with SHA-256 or storing seen hashes in an external lightweight store like Redis or a Bloom filter if approximate deduplication is acceptable.',
    followUpObjectives: 'Probe memory management with generators or streaming large files.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'If the dataset is 100 GB and cannot fit into RAM on your machine, how would you deduplicate it without crashing?',
        objective: 'Test external sorting, map-reduce, or disk-backed hashing.',
        difficulty: 'Hard',
      }
    ]
  },

  // ==========================================
  // 2. BACKEND DEVELOPER (EXPERIENCED / 3-5 YEARS)
  // ==========================================
  {
    id: 'be-mid-api-perf-1',
    jobRole: 'Backend Developer',
    experienceLevel: '3-5 Years',
    interviewType: 'Technical',
    topic: 'Backend Architecture',
    subtopic: 'High-Concurrency & Bottleneck Diagnosis',
    difficulty: 'Medium',
    category: 'Scenario-Based Problem Solving',
    question: 'Your backend REST API experiences severe latency spikes and connection timeouts whenever hundreds of concurrent users send requests during peak traffic, while CPU utilization on the application server remains under 25%. How would you systematically investigate and isolate the bottleneck? Discuss database connection pooling, query patterns, caching strategies, and telemetry.',
    expectedCompetencies: ['APM & telemetry profiling', 'Database connection pool starvation', 'N+1 queries & lock contention', 'Caching strategies (Redis, read-through)', 'Thread/worker pool exhaustion'],
    expectedDepth: '2–3 minutes: systematically walk through observability, database connection limits, query analysis, caching, and thread pool metrics.',
    evaluationRubric: {
      technicalAccuracy: 'Identifies that low application CPU combined with high latency strongly points to I/O or pool starvation (DB connection pool, slow queries, thread pool blocking).',
      relevance: 'Addresses the specific scenario of low app CPU with high latency during concurrent spikes.',
      completeness: 'Thoroughly covers DB connection pool sizing, slow queries / locks, caching layer, and APM tracing.',
      clarity: 'Structured investigation phases: Observability -> Resource Pool Analysis -> DB Profiling -> Remediation.',
      problemSolving: 'Demonstrates senior diagnostic instincts rather than shotgun optimization.',
      communication: 'Professional distributed system terminology (p99 latency, connection pool saturation, thread blocking, distributed tracing).'
    },
    idealAnswer: 'Low CPU (<25%) coupled with high latency indicates that application threads are spending their time waiting on external I/O rather than executing computation. My systematic investigation would be: 1) APM & Distributed Tracing: Inspect OpenTelemetry or Datadog traces to inspect the p95/p99 breakdown—specifically checking if time is spent waiting to acquire a database connection, executing a specific database query, or calling an external third-party API. 2) Database Connection Pool: Check whether the application\'s connection pool (e.g. HikariCP, pgBouncer) is exhausted. If pool size is 10 and 200 requests arrive, 190 threads block waiting for a pool connection, causing timeouts despite idle CPU. 3) Database Server Metrics: Inspect slow query logs, table locks, and DB server CPU/disk I/O. Check for missing indexes or unindexed JOINs causing full table scans. 4) Remediation: Tune connection pool sizes to match database concurrency limits; introduce an in-memory cache (Redis) with a cache-aside pattern for hot read data; ensure HTTP keep-alive is enabled; and use asynchronous/non-blocking I/O or connection pooling proxies like pgBouncer.',
    followUpObjectives: 'Probe cache invalidation strategies or handling database connection storms.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'How would you prevent a "Cache Stampede" (thundering herd) when a heavily queried cached key expires during peak traffic?',
        objective: 'Test mutex locking, probabilistic early expiration (XFetch), or background cache refresh.',
        difficulty: 'Hard',
      }
    ]
  },
  {
    id: 'be-mid-db-acid-1',
    jobRole: 'Backend Developer',
    experienceLevel: '3-5 Years',
    interviewType: 'Technical',
    topic: 'Database Engineering',
    subtopic: 'Transaction Isolation & Idempotency',
    difficulty: 'Hard',
    category: 'Design & Architecture Decisions',
    question: 'You are designing an e-commerce checkout and payment service. A user accidentally clicks "Pay" twice in rapid succession, or network timeouts cause the client to retry the payment request. How do you guarantee that the user is only charged once, inventory is decremented accurately without race conditions, and transactions remain consistent across network failures?',
    expectedCompetencies: ['Idempotency keys & unique constraints', 'Distributed transactions vs Saga / outbox pattern', 'Optimistic vs pessimistic locking', 'Pessimistic SELECT FOR UPDATE / conditional updates'],
    expectedDepth: '2–3 minutes: discuss idempotency tokens, atomic inventory deduction with conditional writes, and webhook/retry coordination.',
    evaluationRubric: {
      technicalAccuracy: 'Understands client-generated idempotency keys with unique database constraints to reject duplicate processing.',
      relevance: 'Directly addresses both double-charging and inventory decrement race conditions.',
      completeness: 'Explains database locking (SELECT FOR UPDATE or `WHERE stock >= qty`), idempotency state machine, and payment gateway coordination.',
      clarity: 'Outlines the end-to-end flow from request arrival to gateway confirmation in clear sequential steps.',
      problemSolving: 'Addresses edge cases like network drops between payment gateway and server response.',
      communication: 'Industry-standard terminology (idempotency key, atomic conditional update, transactional outbox).'
    },
    idealAnswer: 'To ensure payment and inventory consistency: 1) Client Idempotency Key: The client generates a unique UUID (Idempotency-Key) attached to the checkout header. The backend checks an `idempotency_records` table with a unique constraint. If a record with this key is already "processing" or "completed", the server returns the cached result or rejects duplicate submission. 2) Inventory Allocation: We prevent overselling using an atomic conditional SQL update: `UPDATE products SET stock = stock - :qty WHERE id = :id AND stock >= :qty;`. If affected rows is 0, out of stock is returned immediately without dirty reads. Alternatively, pessimistic locking (`SELECT ... FOR UPDATE`) can lock the product row during the transaction. 3) Payment Gateway Integration: We pass the same idempotency key to the payment provider (e.g. Stripe). If a timeout occurs after the gateway processed the charge, the subsequent retry passes the same key, ensuring the gateway returns the existing charge without debiting again. 4) State Machine & Webhooks: Store orders in a \'PENDING\' status and listen for asynchronous payment webhooks with an outbox pattern to finalize order state.',
    followUpObjectives: 'Probe handling two-phase commits vs eventual consistency.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'If inventory and payment reside in two separate microservices with independent databases, how would you coordinate them without two-phase commit (2PC)?',
        objective: 'Test Saga pattern (orchestration/choreography) and compensating transactions.',
        difficulty: 'Hard',
      }
    ]
  },

  // ==========================================
  // 3. FRONTEND DEVELOPER (FRESHER & EXPERIENCED)
  // ==========================================
  {
    id: 'fe-react-perf-1',
    jobRole: 'Frontend Developer',
    experienceLevel: '1-2 Years',
    interviewType: 'Technical',
    topic: 'React & Web Architecture',
    subtopic: 'Re-render Optimization & State Flow',
    difficulty: 'Medium',
    category: 'Scenario-Based Problem Solving',
    question: 'A React application renders a large list of 5,000 items. Users complain that typing in a search input feels laggy and freezes the UI because the entire list component re-renders after every single keystroke. How would you identify the exact cause of the unnecessary re-renders, and what techniques would you apply to achieve a smooth 60fps typing experience without causing stale state or missing search results?',
    expectedCompetencies: ['React DevTools Profiler', 'Debouncing / Throttling vs Concurrent features (useDeferredValue)', 'Component memoization (React.memo, useMemo, useCallback)', 'List virtualization (react-window / virtualizer)'],
    expectedDepth: '1–2 minutes: profile with React Profiler, separate state/debounce search query, memoize items, and apply list virtualization.',
    evaluationRubric: {
      technicalAccuracy: 'Correctly identifies that parent state update forces all children to re-render, and rendering 5,000 real DOM nodes causes DOM layout thrashing.',
      relevance: 'Addresses both typing responsiveness and large list rendering performance.',
      completeness: 'Covers profiling with React Profiler, input state isolation/debouncing/useDeferredValue, and DOM virtualization.',
      clarity: 'Structured into diagnosis -> state restructuring -> DOM virtualization.',
      problemSolving: 'Distinguishes between preventing React component re-computations and reducing physical DOM nodes.',
      communication: 'Uses exact React terminology (reconciliation, virtual DOM, virtualization, synthetic events).'
    },
    idealAnswer: '1) Profiling: Open React DevTools Profiler with "Highlight updates when components render" enabled to record typing and verify which components re-render and measure render duration. 2) State Separation: If search text and the list live in the same component, every keystroke updates state, re-executing the entire component tree. Separate the search input state from the expensive list, or use React 18\'s `useDeferredValue(searchQuery)` or `useTransition()` so typing takes urgent priority while filtering runs non-urgently. 3) List Virtualization: Rendering 5,000 DOM elements overwhelms browser layout and painting. Using a virtualized list (e.g. `@tanstack/react-virtual` or `react-window`) only renders the 15–20 items currently visible in the viewport, reducing DOM nodes from 5,000 to ~25. 4) Memoization: Wrap individual list row components in `React.memo` with stable props (using `useCallback` for event handlers) so only rows whose specific data changed re-render.',
    followUpObjectives: 'Probe differences between debounce, throttle, and useDeferredValue.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'What is the architectural difference between client-side debouncing with setTimeout and React 18\'s useTransition or useDeferredValue?',
        objective: 'Test React concurrent rendering mechanics and interruptible renders.',
        difficulty: 'Medium',
      }
    ]
  },
  {
    id: 'fe-web-sec-1',
    jobRole: 'Frontend Developer',
    experienceLevel: '3-5 Years',
    interviewType: 'Technical',
    topic: 'Web Security & Architecture',
    subtopic: 'XSS, CSRF, and Authentication Storage',
    difficulty: 'Hard',
    category: 'Trade-Off Analysis',
    question: 'When implementing user authentication in a Single Page Application (SPA), compare storing authentication tokens (JWTs) in `localStorage` versus `httpOnly` `SameSite` cookies. Analyze the security vulnerabilities associated with each (XSS vs CSRF), and explain the trade-offs regarding token refresh, mobile client reuse, and SSR (Server-Side Rendering).',
    expectedCompetencies: ['Cross-Site Scripting (XSS) vectors', 'Cross-Site Request Forgery (CSRF) defenses', 'httpOnly & SameSite cookie attributes', 'SSR token hydration considerations'],
    expectedDepth: '2–3 minutes: compare XSS vulnerability in localStorage vs CSRF risks in cookies, explain httpOnly protection, and discuss token refreshing with SSR.',
    evaluationRubric: {
      technicalAccuracy: 'Correctly notes that JavaScript can read localStorage (high XSS risk), while httpOnly cookies are inaccessible to document.cookie.',
      relevance: 'Compares both storage mechanisms directly across security, SSR, and architectural trade-offs.',
      completeness: 'Covers XSS, CSRF (mitigated by SameSite=Strict/Lax or anti-CSRF tokens), refresh token rotation, and SSR access on the initial server request.',
      clarity: 'Presents clear trade-off matrix: Security vs Developer Ergonomics vs SSR compatibility.',
      problemSolving: 'Recommends production-grade patterns (e.g., short-lived access token in memory + httpOnly refresh token cookie).',
      communication: 'Precise cybersecurity and web standard terminology.'
    },
    idealAnswer: '1) `localStorage`: Tokens in localStorage are accessible to any JavaScript running on the origin. If the app suffers from a Cross-Site Scripting (XSS) vulnerability (e.g., through a compromised third-party npm package or unsanitized user content), an attacker can read the JWT and exfiltrate it. However, it is immune to CSRF and easy to send across different domain APIs or mobile apps. 2) `httpOnly` `SameSite` Cookies: Inaccessible to client JavaScript, providing robust protection against XSS token exfiltration. However, cookies are automatically sent with browser requests, opening up CSRF vulnerabilities unless mitigated by `SameSite=Strict/Lax` and anti-CSRF double-submit tokens. 3) Architecture & SSR: For Next.js/SSR, httpOnly cookies are ideal because the initial server request automatically carries the cookie in headers, allowing immediate authenticated server-side data fetching without flash-of-unauthenticated-state. 4) Recommended Practice: Keep short-lived access tokens (5–15 mins) in memory (React state/closure), and keep long-lived refresh tokens in a secure, httpOnly, SameSite=Strict, path-restricted cookie with automatic token rotation.',
    followUpObjectives: 'Probe Content Security Policy (CSP) headers or JWT signature verification.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'How does Content Security Policy (CSP) provide defense-in-depth against XSS token theft even if malicious script injection occurs?',
        objective: 'Test script-src, nonces, and connect-src exfiltration blocking.',
        difficulty: 'Medium',
      }
    ]
  },

  // ==========================================
  // 4. PROJECT-BASED TECHNICAL DISCUSSIONS (ALL ROLES)
  // ==========================================
  {
    id: 'proj-arch-deep-dive-1',
    jobRole: 'Software Developer',
    experienceLevel: 'All',
    interviewType: 'Technical',
    topic: 'System Architecture & Engineering Judgment',
    subtopic: 'Project Architecture & Technical Trade-offs',
    difficulty: 'Medium',
    category: 'Project-Based Technical Discussion',
    question: 'Describe the architecture of a real-world software project you have designed or built. Walk through: 1) The core technical requirements and high-level component architecture. 2) One difficult technical decision you had to make and an alternative you evaluated. 3) How you verified correctness and performance. 4) What concrete architectural changes you would make if user traffic or data volume scaled 10x.',
    expectedCompetencies: ['Architecture articulation', 'Trade-off justification', 'Testing and observability', 'Scalability bottlenecks and scaling strategies'],
    expectedDepth: '2–3 minutes: structured overview of architecture, concrete trade-off comparison, testing strategy, and horizontal scaling/caching plan for 10x growth.',
    evaluationRubric: {
      technicalAccuracy: 'Articulates realistic architectural components (clients, gateway/load balancer, services, caching, database, async queues).',
      relevance: 'Follows all four requested aspects (architecture, difficult decision, testing, 10x scaling).',
      completeness: 'Names specific technologies, explains why an alternative was rejected, and identifies real bottlenecks for 10x scale.',
      clarity: 'Structured narrative: Context -> Architecture -> Critical Decision -> Testing -> Scaling Bottlenecks.',
      problemSolving: 'Demonstrates genuine engineering maturity and self-reflection.',
      communication: 'Professional engineering communication without hand-waving.'
    },
    idealAnswer: 'A strong candidate response follows a clear four-part structure: 1) Architecture: E.g., a microservices/modular monolith backend with Node.js/Next.js, PostgreSQL for relational transactional data, Redis for caching session and rate limits, and AWS S3 for object storage. 2) Difficult Technical Decision: E.g., deciding between WebSockets vs Server-Sent Events (SSE) for real-time status notifications. Chose SSE because notifications were unidirectional from server to client, simplifying connection management through HTTP/2 multiplexing and eliminating the custom reconnection/heartbeat overhead of WebSockets. 3) Verification: Implemented unit tests for business logic, integration tests with Testcontainers against real Postgres instances, and load tested with k6 to verify response times stayed under 200ms at 500 RPS. 4) 10x Scaling Strategy: The primary bottleneck would be the single PostgreSQL primary. For 10x traffic, introduce read replicas with connection pooling (pgBouncer), offload heavy background tasks to an asynchronous message queue (RabbitMQ/SQS), and implement database table partitioning or Redis caching on top read endpoints.',
    followUpObjectives: 'Probe the candidate on failure handling or data consistency during their 10x scale plan.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'In your scaling plan, how would you handle read-after-write consistency if a user writes to the primary database and immediately reads from a lagging read replica?',
        objective: 'Test replication lag mitigation (sticky sessions, reading own writes from primary, version checks).',
        difficulty: 'Hard',
      }
    ]
  },

  // ==========================================
  // 5. BEHAVIORAL & STAR METHOD (HR & MIXED INTERVIEWS)
  // ==========================================
  {
    id: 'beh-star-conflict-1',
    jobRole: 'Software Developer',
    experienceLevel: 'All',
    interviewType: 'Behavioral',
    topic: 'Engineering Culture & Collaboration',
    subtopic: 'Technical Disagreements & Conflict Resolution',
    difficulty: 'Medium',
    category: 'Behavioral (STAR Method)',
    question: 'Describe a situation where you had a strong technical disagreement with a team member, tech lead, or product manager regarding how a feature should be built or designed. Walk through the Situation, Task, Action you took to resolve it objectively, and the final Result.',
    expectedCompetencies: ['STAR structure (Situation, Task, Action, Result)', 'Objective data-driven decision making', 'Empathetic communication', 'Team alignment & accountability'],
    expectedDepth: '1.5–3 minutes: structured STAR response highlighting objective benchmarking or proof-of-concept rather than emotional arguing.',
    evaluationRubric: {
      technicalAccuracy: 'Focuses on sound engineering trade-offs (performance, delivery speed, maintenance costs) as the basis of discussion.',
      relevance: 'Follows the STAR framework strictly without getting lost in trivial details.',
      completeness: 'Clear Situation context, defined Task, specific Actions taken, and quantified or clear Result.',
      clarity: 'Clean narrative progression from conflict to resolution and mutual respect.',
      problemSolving: 'Shows maturity by using prototypes, benchmarks, or documentation to settle debates objectively.',
      communication: 'Respectful, collaborative, and professional tone.'
    },
    idealAnswer: 'Situation: In a previous project, a senior engineer wanted to build a custom in-memory caching and queuing layer, while I advocated for using an established tool like Redis. Task: We needed to decide within two days because the release timeline was tight, and our agreement was essential for architectural consistency. Action: Rather than arguing subjectively, I created a quick decision matrix and a 3-hour spike. I documented the maintenance cost, clustering complexity, memory recovery on crash, and benchmarked serialization latency of the custom solution vs Redis. I presented the findings to the team and invited the senior engineer to review the trade-offs collaboratively. Result: The team agreed that Redis significantly lowered operational risk and saved an estimated three weeks of engineering time. The senior engineer appreciated the objective benchmark approach, and the feature launched on schedule with zero caching incidents in production.',
    followUpObjectives: 'Probe candidate self-reflection: what would you have done if your recommendation was rejected?',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'What would you have done if the team lead still chose the custom in-memory solution despite your benchmark data?',
        objective: 'Test "Disagree and Commit" philosophy and professional ownership.',
        difficulty: 'Medium',
      }
    ]
  },
  {
    id: 'beh-star-incident-1',
    jobRole: 'Software Developer',
    experienceLevel: 'All',
    interviewType: 'Behavioral',
    topic: 'Production Incidents & Ownership',
    subtopic: 'Handling Failure & Blameless Post-Mortems',
    difficulty: 'Medium',
    category: 'Behavioral (STAR Method)',
    question: 'Tell me about a time when a critical bug or performance failure you introduced or owned slipped into production. How did you respond under pressure, communicate with stakeholders, mitigate the immediate issue, and what systemic changes did you introduce to prevent it from ever happening again?',
    expectedCompetencies: ['Calm incident response', 'Transparent stakeholder communication', 'Root-cause analysis', 'Blameless post-mortem & automated guardrails'],
    expectedDepth: '1.5–3 minutes: STAR story with immediate rollback/mitigation, incident communication, root cause, and automated CI/CD prevention.',
    evaluationRubric: {
      technicalAccuracy: 'Describes realistic production incident workflow (rollback, traffic rerouting, logs inspection, regression test).',
      relevance: 'Answers the prompt with honest accountability and positive systemic prevention.',
      completeness: 'Explains detection, mitigation, communication, and long-term prevention mechanisms.',
      clarity: 'Structured narrative: Incident -> Immediate Triage -> Communication -> Post-Mortem.',
      problemSolving: 'Demonstrates bias toward immediate mitigation over panicking, followed by systemic prevention.',
      communication: 'Humility, extreme ownership, and professional poise.'
    },
    idealAnswer: 'Situation: During a Friday afternoon release, a database migration added a column with a non-concurrent index on a table with 10 million rows, causing a table lock that queued incoming API requests and spiked error rates to 40%. Task: My immediate priority was restoring service availability and informing stakeholders, then fixing the root cause. Action: I immediately triggered a rollback to the previous deployment artifact and killed the locking query on the database replica. Within 5 minutes, I updated the incident communication channel with status, impact, and ETA. Once service was restored, I led a blameless post-mortem to determine why this passed staging. Result: Service recovered within 8 minutes of detection. As a permanent fix, I added a migration linter to our CI/CD pipeline that automatically fails any PR attempting non-concurrent index creation on PostgreSQL, and established a policy requiring index builds to run off-peak.',
    followUpObjectives: 'Probe continuous delivery policies and team learning.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'How do you balance rapid delivery velocity with rigorous safety checks in your deployment pipeline?',
        objective: 'Test continuous deployment guardrails (canary deployments, automated rollbacks, feature flags).',
        difficulty: 'Medium',
      }
    ]
  },

  // ==========================================
  // 6. SQL & DATABASE SPECIALIZED CHALLENGES
  // ==========================================
  {
    id: 'db-sql-complex-1',
    jobRole: 'Software Developer',
    experienceLevel: '1-2 Years',
    interviewType: 'Technical',
    topic: 'Database Engineering',
    subtopic: 'Advanced SQL & Window Functions',
    difficulty: 'Medium',
    category: 'SQL & Database Problem Solving',
    question: 'You are given two tables: `Customers(id, name, signup_date)` and `Orders(id, customer_id, order_date, total_amount)`. Write an SQL query to find: 1) Customers who have never placed an order. 2) For customers who have ordered, calculate their running total of spending ordered chronologically by `order_date`.',
    expectedCompetencies: ['LEFT JOIN / NOT EXISTS for orphan records', 'SUM() OVER (PARTITION BY ... ORDER BY ...) window functions', 'Handling multiple analytical requirements'],
    expectedDepth: '1–2 minutes: provide query for customers with no orders (LEFT JOIN WHERE IS NULL or NOT EXISTS), and demonstrate windowed running sum.',
    evaluationRubric: {
      technicalAccuracy: 'Uses LEFT JOIN WHERE o.id IS NULL (or NOT EXISTS) correctly. Uses SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date) for running total.',
      relevance: 'Accurately addresses both analytical queries.',
      completeness: 'Provides clean SQL code and explains why NOT EXISTS or LEFT JOIN is efficient.',
      clarity: 'Clear separation between Part 1 and Part 2.',
      problemSolving: 'Explains window function frame specification (RANGE vs ROWS) if duplicate order dates exist.',
      communication: 'Exact SQL standards.'
    },
    idealAnswer: 'Part 1: Customers with no orders:\nSELECT c.id, c.name\nFROM Customers c\nLEFT JOIN Orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;\n-- Alternatively using NOT EXISTS which query planners often optimize very well:\n-- SELECT id, name FROM Customers c WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.customer_id = c.id);\n\nPart 2: Running total of spending per customer:\nSELECT \n  customer_id,\n  order_date,\n  total_amount,\n  SUM(total_amount) OVER (\n    PARTITION BY customer_id \n    ORDER BY order_date\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS running_total\nFROM Orders\nORDER BY customer_id, order_date;\n\nSpecifying `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` ensures that even if two orders happen on the exact same date, the running sum accumulates row by row rather than clumping duplicate dates together as `RANGE` would.',
    followUpObjectives: 'Probe index optimization for the window query.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'What composite index would you place on the Orders table to allow the database engine to compute this running sum without an in-memory sort?',
        objective: 'Test composite index (customer_id, order_date, total_amount).',
        difficulty: 'Medium',
      }
    ]
  },

  // ==========================================
  // 7. SYSTEM DESIGN & ARCHITECTURE DECISIONS
  // ==========================================
  {
    id: 'sys-design-rate-limiter-1',
    jobRole: 'Software Developer',
    experienceLevel: '3-5 Years',
    interviewType: 'Technical',
    topic: 'Distributed Systems',
    subtopic: 'API Rate Limiting & Sliding Windows',
    difficulty: 'Hard',
    category: 'Design & Architecture Decisions',
    question: 'Design a distributed API rate limiter that allows a maximum of 100 requests per minute per API key across multiple load-balanced web servers. Compare the Token Bucket and Sliding Window Log algorithms, explain how you would maintain counters in Redis with sub-millisecond latency, and address race conditions when multiple requests hit different servers simultaneously.',
    expectedCompetencies: ['Rate limiting algorithms (Token bucket, Leaky bucket, Fixed window, Sliding window counter)', 'Distributed state management with Redis', 'Atomic Redis execution (Lua scripts / MULTI-EXEC)', 'Graceful degradation when Redis is unreachable'],
    expectedDepth: '2–3 minutes: compare algorithms, diagram Redis data structure (sorted sets or sliding window counter), and explain atomic Lua script execution.',
    evaluationRubric: {
      technicalAccuracy: 'Accurately explains Token Bucket memory/burst efficiency vs Sliding Window precision. Identifies atomic Lua script in Redis as the solution to check-then-act race conditions.',
      relevance: 'Directly solves distributed rate limiting across multi-server environment with latency and race condition considerations.',
      completeness: 'Covers algorithm comparison, Redis data structure, atomicity, HTTP 429 response headers (Retry-After, X-RateLimit-Remaining), and failure fallback.',
      clarity: 'Structured explanation from high-level algorithm choice down to low-level atomic Redis execution.',
      problemSolving: 'Demonstrates deep systems understanding (handling Redis failure with fail-open/fail-closed trade-off).',
      communication: 'Standard distributed systems terminology.'
    },
    idealAnswer: '1) Algorithm Comparison: Token Bucket allows bursts up to bucket capacity and requires minimal memory (just last refill timestamp and token count), but burst spikes can briefly stress downstream services. Sliding Window Counter divides the time window into smaller sub-windows, providing smooth rate limiting without memory explosion. 2) Architecture: Place the rate limiting check at an API Gateway or middleware before application routing. Counters are stored in a centralized distributed cache (Redis) rather than in-memory on individual web servers to avoid state fragmentation across servers. 3) Race Condition & Atomicity: If two requests hit Server 1 and Server 2 simultaneously, both might read counter = 99 and allow the request (allowing 101 requests). To ensure atomicity without distributed locks, we execute a Redis Lua Script. Redis executes Lua scripts as a single atomic operation: within the script, we increment the key, set TTL if new, and return whether count <= limit. 4) HTTP Standard Headers: Return standard headers: `X-RateLimit-Limit: 100`, `X-RateLimit-Remaining`, and on breach return HTTP `429 Too Many Requests` with `Retry-After: <seconds>`. 5) Resilience: If Redis goes down, implement a fail-open circuit breaker with a local in-memory fallback to avoid taking down all API traffic.',
    followUpObjectives: 'Probe sliding window log with Redis Sorted Sets vs sliding window counter.',
    possibleFollowUps: [
      {
        triggerCondition: 'high_score',
        question: 'How does a Redis Sorted Set (ZSET) sliding window log work, and what is its memory trade-off compared to a token bucket when millions of users are active?',
        objective: 'Test ZADD with timestamp score, ZREMRANGEBYSCORE, and memory footprint analysis.',
        difficulty: 'Hard',
      }
    ]
  }
];

export class QuestionBankEngine {
  /**
   * Filters the question bank based on candidate role, experience level, interview type,
   * difficulty, and session history (excluding already asked questions).
   */
  static selectQuestion(options: {
    jobRole: string;
    experienceLevel: string;
    interviewType: string;
    difficulty: string;
    excludeIds?: string[];
    weakTopics?: string[];
  }): StructuredQuestion | null {
    const { jobRole, experienceLevel, interviewType, difficulty, excludeIds = [], weakTopics = [] } = options;

    const normalizedDiff = difficulty.toLowerCase();
    const normalizedType = interviewType.toLowerCase();

    // 1. Filter bank matching basic criteria
    let candidates = REALISTIC_QUESTION_BANK.filter(q => {
      if (excludeIds.includes(q.id)) return false;

      // Match interview type if not Mixed
      if (normalizedType !== 'mixed') {
        if (q.interviewType.toLowerCase() !== normalizedType && normalizedType !== 'technical') {
          // If seeking HR/Behavioral, don't pick technical unless mixed
          if (normalizedType === 'behavioral' || normalizedType === 'hr') {
            if (q.interviewType.toLowerCase() !== 'behavioral' && q.interviewType.toLowerCase() !== 'hr') {
              return false;
            }
          }
        }
      }

      return true;
    });

    if (candidates.length === 0) {
      // Relax exclude filter if we exhausted questions
      candidates = REALISTIC_QUESTION_BANK;
    }

    // 2. Score candidate questions based on relevance
    const scored = candidates.map(q => {
      let score = 0;

      // Role affinity
      if (q.jobRole.toLowerCase() === jobRole.toLowerCase() || q.jobRole === 'All') score += 4;
      else if (jobRole.toLowerCase().includes('developer') && q.jobRole.includes('Developer')) score += 3;

      // Experience level calibration
      if (q.experienceLevel === 'All' || q.experienceLevel.toLowerCase() === experienceLevel.toLowerCase()) score += 3;
      else if (experienceLevel === 'Fresher' && (q.difficulty === 'Easy' || q.difficulty === 'Medium')) score += 2;
      else if (experienceLevel === '3-5 Years' && (q.difficulty === 'Medium' || q.difficulty === 'Hard')) score += 2;

      // Difficulty match
      if (q.difficulty.toLowerCase() === normalizedDiff) score += 3;

      // Weak topics priority
      if (weakTopics.some(wt => q.topic.toLowerCase().includes(wt.toLowerCase()))) score += 4;

      return { question: q, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.question || REALISTIC_QUESTION_BANK[0];
  }

  /**
   * Generates a context-aware follow-up question probing the candidate's specific answer.
   */
  static generateFollowUp(parentQuestion: StructuredQuestion, userAnswer: string, answerScore: number): StructuredQuestion {
    const textLower = userAnswer.toLowerCase();

    // Check pre-configured possible follow-ups
    if (parentQuestion.possibleFollowUps && parentQuestion.possibleFollowUps.length > 0) {
      if (answerScore >= 7.5) {
        const highMatch = parentQuestion.possibleFollowUps.find(f => f.triggerCondition === 'high_score');
        if (highMatch) {
          return {
            id: `${parentQuestion.id}-followup`,
            jobRole: parentQuestion.jobRole,
            experienceLevel: parentQuestion.experienceLevel,
            interviewType: parentQuestion.interviewType,
            topic: parentQuestion.topic,
            subtopic: parentQuestion.subtopic,
            difficulty: highMatch.difficulty,
            category: 'Follow-Up Probing',
            question: highMatch.question,
            expectedCompetencies: [...parentQuestion.expectedCompetencies, 'Follow-up reasoning & deeper edge cases'],
            evaluationRubric: parentQuestion.evaluationRubric,
            expectedDepth: '60–90 seconds direct elaboration on trade-offs and edge cases.',
            idealAnswer: `For this follow-up on ${parentQuestion.topic}, address the specific constraint trade-off and outline the modified approach with time/space complexity implications.`,
            isFollowUp: true,
            followUpObjectives: highMatch.objective,
          } as any;
        }
      } else {
        const lowMatch = parentQuestion.possibleFollowUps.find(f => f.triggerCondition === 'low_score');
        if (lowMatch) {
          return {
            id: `${parentQuestion.id}-followup`,
            jobRole: parentQuestion.jobRole,
            experienceLevel: parentQuestion.experienceLevel,
            interviewType: parentQuestion.interviewType,
            topic: parentQuestion.topic,
            subtopic: parentQuestion.subtopic,
            difficulty: lowMatch.difficulty,
            category: 'Follow-Up Probing',
            question: lowMatch.question,
            expectedCompetencies: parentQuestion.expectedCompetencies,
            evaluationRubric: parentQuestion.evaluationRubric,
            expectedDepth: '45–90 seconds walkthrough of basic logic or concrete example.',
            idealAnswer: `Walk through the fundamental mechanics step-by-step with a clear concrete example.`,
            isFollowUp: true,
            followUpObjectives: lowMatch.objective,
          } as any;
        }
      }
    }

    // Dynamic follow-up based on key terms or score
    const isGoodScore = answerScore >= 7.0;
    const followUpText = isGoodScore
      ? `You mentioned several key points regarding ${parentQuestion.subtopic || parentQuestion.topic}. Could you elaborate on one significant trade-off or failure scenario of this approach, and how you would design automated testing to catch it?`
      : `Looking deeper into ${parentQuestion.subtopic || parentQuestion.topic}, how would you test or verify this logic with concrete sample inputs to ensure no edge cases cause unexpected runtime errors?`;

    return {
      id: `${parentQuestion.id}-dynamic-followup`,
      jobRole: parentQuestion.jobRole,
      experienceLevel: parentQuestion.experienceLevel,
      interviewType: parentQuestion.interviewType,
      topic: parentQuestion.topic,
      subtopic: parentQuestion.subtopic,
      difficulty: isGoodScore ? 'Hard' : 'Medium',
      category: 'Follow-Up Probing',
      question: followUpText,
      expectedCompetencies: ['Verification and testing', 'Edge-case identification', 'Practical engineering reasoning'],
      evaluationRubric: parentQuestion.evaluationRubric,
      expectedDepth: '60–90 seconds explanation of trade-offs and verification.',
      idealAnswer: 'A strong follow-up response highlights concrete edge cases, failure modes, and automated regression testing strategies.',
      isFollowUp: true,
      followUpObjectives: 'Test depth of understanding and self-verification skills.',
    } as any;
  }
}

