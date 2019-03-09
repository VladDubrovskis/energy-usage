Candidate Name: Vlad Dubrovskis

Tasks: 2 and 3

Time: 3-4 hours 

Notes:
- Added `supertest` to test the service and removed the initial test - as does not really matter if is Koa running the service as long as there is an endpoint that works.
- Could add some valdiation - e.g. if the user attempts to submit a reading that is lower, or if there is already a reading this month (e.g. based on the assumptions in README)
- Could also validate payload and return 400 if invalid
- Specifically went with supertest as wanted to test the behaviour and not the implementation. If the application would be a lot mre resource heavy may have approached the testing in a different way.
- Calculation for the estimate will be done based on idea that last 2 entries are from current and previous month. In real application probably would validate that before estimation
- Also would probably make the current request date play some role in decision making, or make it a parameter 
