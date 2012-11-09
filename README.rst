=====
Concept
=====
--------
Given today's technology there is no reason we should not be able to exercise our democratic rights via the internet.

This OpenDemocracy project will be an effort to create a community verified implementation of a 
safe, secure, anonymous, verifiable internet voting mechanism. The idea is to use modern cryptographic
technology, the same that's used to manage every multi-billion dollar account, or transfer confidential
state documents.

=====
Requirements
=====
Overview
--------
- One auth token must be certified per voter by an election official, ensures 1 person, 1 vote
- User must have additional auth token challenge - password, private key, etc
- Must restrict user to voting only once per election on any ballot issue or candidate
- Must anonymize actual votes
- Need to prevent this person from voting again in person


=====
=====
Challenges
--------
- How do we prevent a person from voting online and in person? - *How is this done for absentee and provisional ballots currently?*
 	

=====
=====
Authentication - Possible implementations
--------
- client certificates
- passwords using advanced, but slow, hashing
- mixture of the two...

