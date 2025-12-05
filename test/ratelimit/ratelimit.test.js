import assert from "node:assert";
import autoCannon from "autocannon";

const port = process.env.PORT;
const rateLimitWindow = process.env.RATE_LIMIT_WINDOW;
const rateLimitAmount = process.env.RATE_LIMIT_AMOUNT;

if (!port) {
  console.error("Missing port environment variable.");
  process.exit();
}

const createTestConfig = (amount, duration) => ({
  url: `http://127.0.0.1:${port}`,
  amount,
  duration,
});

function appliesRateLimits() {
  const excessiveRequests = 5;
  const testConfig = createTestConfig(
    Number.parseInt(rateLimitAmount) + excessiveRequests,
    Number.parseInt(rateLimitWindow)
  );
  autoCannon(testConfig).then((result) => {
    const ratelimitedResponses = result.statusCodeStats["429"]?.count;
    const expected = excessiveRequests;
    const errorMessage = `"[TEST FAILED]" \n Ratelimited responses: ${ratelimitedResponses} \n expected: ${expected}`;
    assert.equal(result.statusCodeStats["200"].count, rateLimitAmount);
    assert.equal(ratelimitedResponses, expected, Error(errorMessage));
    console.log("[TEST PASSED]");
    console.log("expected: testConfig ", expected);
    console.log("got: ", ratelimitedResponses);
  });
}

function run() {
  appliesRateLimits();
}

run();
