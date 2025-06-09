const fs = require('fs');
const path = require('path');

function analyzeTestResults(reportPath) {
    try {
        if (!fs.existsSync(reportPath)) {
            console.error(`❌ Report file not found: ${reportPath}`);
            process.exit(1);
        }

        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        const summary = {
            totalTests: report.run.stats.tests.total,
            passedTests: report.run.stats.tests.total - report.run.stats.tests.failed,
            failedTests: report.run.stats.tests.failed,
            skippedTests: report.run.stats.tests.pending || 0,
            averageResponseTime: calculateAverageResponseTime(report.run.executions),
            successRate: ((report.run.stats.tests.total - report.run.stats.tests.failed) / report.run.stats.tests.total * 100).toFixed(2),
            totalRequests: report.run.stats.requests.total,
            failedRequests: report.run.stats.requests.failed
        };
        
        console.log('📊 API Test Results Summary');
        console.log('=' .repeat(50));
        console.log(`✅ Passed Tests: ${summary.passedTests}/${summary.totalTests}`);
        console.log(`❌ Failed Tests: ${summary.failedTests}`);
        console.log(`⏭️  Skipped Tests: ${summary.skippedTests}`);
        console.log(`🚀 Total Requests: ${summary.totalRequests}`);
        console.log(`💥 Failed Requests: ${summary.failedRequests}`);
        console.log(`⚡ Average Response Time: ${summary.averageResponseTime}ms`);
        console.log(`📈 Success Rate: ${summary.successRate}%`);
        console.log('=' .repeat(50));
        
        // Performance analysis
        analyzePerformance(report.run.executions);
        
        // Error analysis
        if (summary.failedTests > 0) {
            analyzeErrors(report.run.executions);
        }
        
        // Generate recommendations
        generateRecommendations(summary, report.run.executions);
        
        return summary;
        
    } catch (error) {
        console.error(`❌ Error analyzing results: ${error.message}`);
        process.exit(1);
    }
}

function calculateAverageResponseTime(executions) {
    const totalTime = executions.reduce((sum, exec) => {
        return sum + (exec.response ? exec.response.responseTime : 0);
    }, 0);
    return Math.round(totalTime / executions.length);
}

function analyzePerformance(executions) {
    console.log('\n🔥 Performance Analysis');
    console.log('-'.repeat(30));
    
    const responseTimes = executions
        .filter(exec => exec.response)
        .map(exec => exec.response.responseTime);
    
    if (responseTimes.length === 0) {
        console.log('No response time data available');
        return;
    }
    
    const sortedTimes = responseTimes.sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    
    console.log(`📊 P50 Response Time: ${p50}ms`);
    console.log(`📊 P95 Response Time: ${p95}ms`);
    console.log(`📊 P99 Response Time: ${p99}ms`);
    console.log(`🐌 Slowest Request: ${Math.max(...responseTimes)}ms`);
    console.log(`⚡ Fastest Request: ${Math.min(...responseTimes)}ms`);
}

function analyzeErrors(executions) {
    console.log('\n🚨 Error Analysis');
    console.log('-'.repeat(30));
    
    const errors = [];
    
    executions.forEach(execution => {
        if (execution.assertions) {
            execution.assertions.forEach(assertion => {
                if (assertion.error) {
                    errors.push({
                        test: assertion.assertion,
                        error: assertion.error.message,
                        request: execution.item.name
                    });
                }
            });
        }
    });
    
    if (errors.length === 0) {
        console.log('✅ No errors found');
        return;
    }
    
    errors.forEach((error, index) => {
        console.log(`${index + 1}. Request: ${error.request}`);
        console.log(`   Test: ${error.test}`);
        console.log(`   Error: ${error.error}`);
        console.log('');
    });
}

function generateRecommendations(summary, executions) {
    console.log('\n💡 Recommendations');
    console.log('-'.repeat(30));
    
    const recommendations = [];
    
    // Success rate recommendations
    if (summary.successRate < 95) {
        recommendations.push('🔴 Success rate is below 95%. Review failed tests and fix issues.');
    } else if (summary.successRate < 99) {
        recommendations.push('🟡 Success rate is good but could be improved. Review edge cases.');
    } else {
        recommendations.push('🟢 Excellent success rate! Keep up the good work.');
    }
    
    // Performance recommendations
    if (summary.averageResponseTime > 1000) {
        recommendations.push('🔴 Average response time is over 1 second. Consider performance optimization.');
    } else if (summary.averageResponseTime > 500) {
        recommendations.push('🟡 Response time is acceptable but could be improved.');
    } else {
        recommendations.push('🟢 Great response times! API is performing well.');
    }
    
    // Request failure recommendations
    if (summary.failedRequests > 0) {
        recommendations.push('🔴 Some requests failed. Check network connectivity and API availability.');
    }
    
    recommendations.forEach(rec => console.log(rec));
    
    if (recommendations.length === 0) {
        console.log('🎉 All metrics look great! No immediate recommendations.');
    }
}

// CLI usage
if (require.main === module) {
    const reportPath = process.argv[2];
    
    if (!reportPath) {
        console.error('Usage: node analyze-results.js <report-file-path>');
        console.error('Example: node analyze-results.js reports/performance-report.json');
        process.exit(1);
    }
    
    analyzeTestResults(reportPath);
}

module.exports = { analyzeTestResults };