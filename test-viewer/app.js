// Simple Test Viewer - Debug Version
class TestViewer {
  constructor() {
    this.tests = new Map();
    this.consoleOutput = new Map();
    this.selectedTestId = null;
    this.filter = 'all';
    this.stats = { total: 0, passed: 0, failed: 0, running: 0 };
    
    this.elements = {
      status: document.getElementById('status'),
      statTotal: document.getElementById('stat-total'),
      statPassed: document.getElementById('stat-passed'),
      statFailed: document.getElementById('stat-failed'),
      statRunning: document.getElementById('stat-running'),
      testList: document.getElementById('test-list'),
      testDetail: document.getElementById('test-detail'),
      filter: document.getElementById('filter')
    };
    
    console.log('[TestViewer] Initializing...');
    this.init();
  }
  
  init() {
    this.elements.filter.addEventListener('change', (e) => {
      this.filter = e.target.value;
      this.renderTestList();
    });
    
    this.connect();
  }
  
  connect() {
    console.log('[TestViewer] Connecting to /events...');
    const eventSource = new EventSource('/events');
    
    eventSource.onopen = () => {
      console.log('[TestViewer] Connected to server');
      this.elements.status.textContent = 'Connected';
      this.elements.status.className = 'status-badge connected';
    };
    
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('[TestViewer] Received event:', data);
        this.handleEvent(data);
      } catch (err) {
        console.error('[TestViewer] Error parsing event:', err, e.data);
      }
    };
    
    eventSource.onerror = (e) => {
      console.error('[TestViewer] EventSource error:', e);
      this.elements.status.textContent = 'Disconnected';
      this.elements.status.className = 'status-badge';
    };
  }
  
  handleEvent(event) {
    const type = event.meta?.messageType || event.payload?.eventType;
    const data = event.payload?.eventData || event.payload;
    
    console.log(`[Event] ${type}:`, data);
    
    try {
      switch (type) {
        case 'session_request':
          this.elements.status.textContent = 'Running';
          this.elements.status.className = 'status-badge running';
          break;
          
        case 'test_discovery':
          this.handleDiscovery(data);
          break;
          
        case 'test_started':
          this.handleTestStarted(data);
          break;
          
        case 'test_setup':
          this.handleTestSetup(data);
          break;
          
        case 'step_started':
          this.handleStepStarted(data);
          break;
          
        case 'step_completed':
          this.handleStepCompleted(data);
          break;
          
        case 'action':
        case 'assertion':
          this.handleAction(data);
          break;
          
        case 'console':
          this.handleConsole(data);
          break;
          
        case 'test_completed':
          this.handleTestCompleted(data);
          break;
          
        case 'session_end':
          this.elements.status.textContent = data.status === 'passed' ? 'Passed' : 'Completed';
          this.elements.status.className = 'status-badge connected';
          break;
          
        default:
          console.log(`[Event] Unhandled: ${type}`, data);
      }
    } catch (err) {
      console.error(`[Event] Error handling ${type}:`, err, data);
    }
  }
  
  handleDiscovery(data) {
    console.log('[Discovery] Processing discovery data:', data);
    const discovery = data.discovery || data;
    const tests = discovery.tests || [];
    
    console.log(`[Discovery] Found ${tests.length} tests`);
    
    for (const test of tests) {
      const projects = test.projects || [];
      console.log(`[Discovery] Test "${test.title}" has ${projects.length} projects`);
      
      for (const proj of projects) {
        const testId = proj.t || proj.testId;
        console.log(`[Discovery] Creating test entry for ${testId}`);
        
        this.tests.set(testId, {
          testId,
          stableId: test.stableId,
          title: test.title,
          file: test.file,
          line: test.line,
          tags: test.tags || [],
          source: test.source,
          browser: proj.b || proj.browser || 'unknown',
          status: 'pending',
          steps: new Map(),
          actions: new Map(),
          currentStep: null
        });
      }
    }
    
    console.log(`[Discovery] Total tests in map: ${this.tests.size}`);
    this.updateStats();
    this.renderTestList();
  }
  
  handleTestStarted(data) {
    try {
      console.log('[TestStarted] Processing:', data);
      const test = this.tests.get(data.testId);
      if (test) {
        test.status = 'running';
        test.startTime = data.startTime;
        test.workerId = data.workerId;
        test.retry = data.retry || 0;
        
        console.log(`[TestStarted] Updated test ${data.testId} to running`);
        this.updateStats();
        this.renderTestList();
        
        if (this.selectedTestId === data.testId) {
          this.renderTestDetail(data.testId);
        }
      } else {
        console.warn(`[TestStarted] Test not found: ${data.testId}`);
      }
    } catch (err) {
      console.error('[TestStarted] Error:', err, data);
    }
  }
  
  handleTestSetup(data) {
    try {
      console.log('[TestSetup] Processing:', data);
      const test = this.tests.get(data.testId);
      if (test) {
        test.setup = data.setup;
        if (this.selectedTestId === data.testId) {
          this.renderTestDetail(data.testId);
        }
      }
    } catch (err) {
      console.error('[TestSetup] Error:', err, data);
    }
  }
  
  handleStepStarted(data) {
    try {
      console.log('[StepStarted] Processing:', data);
      const test = this.tests.get(data.testId);
      if (test && data.step?.stepId) {
        const step = { ...data.step, status: 'running' };
        test.steps.set(data.step.stepId, step);
        test.currentStep = step;
        test.actions.set(data.step.stepId, []);
        
        console.log(`[StepStarted] Added step ${data.step.stepId}: ${step.title}`);
        
        if (this.selectedTestId === data.testId) {
          this.renderTestDetail(data.testId);
        }
      }
    } catch (err) {
      console.error('[StepStarted] Error:', err, data);
    }
  }
  
  handleStepCompleted(data) {
    try {
      console.log('[StepCompleted] Processing:', data);
      const test = this.tests.get(data.testId);
      if (test && data.step?.stepId) {
        const existingStep = test.steps.get(data.step.stepId);
        if (existingStep) {
          Object.assign(existingStep, data.step, { 
            status: data.step.error ? 'failed' : 'passed'
          });
          test.currentStep = null;
          
          console.log(`[StepCompleted] Updated step ${data.step.stepId} to ${existingStep.status}`);
          
          if (this.selectedTestId === data.testId) {
            this.renderTestDetail(data.testId);
          }
        }
      }
    } catch (err) {
      console.error('[StepCompleted] Error:', err, data);
    }
  }
  
  handleAction(data) {
    try {
      console.log('[Action] Processing:', data);
      const test = this.tests.get(data.testId);
      if (test && data.step?.stepId) {
        let parentStepId = data.step.stepId;
        
        // Find parent step
        if (!test.actions.has(parentStepId)) {
          for (const [stepId, step] of test.steps.entries()) {
            if (step.title === data.step.parent) {
              parentStepId = stepId;
              break;
            }
          }
        }
        
        if (!test.actions.has(parentStepId)) {
          test.actions.set(parentStepId, []);
        }
        
        test.actions.get(parentStepId).push(data.step);
        console.log(`[Action] Added action to step ${parentStepId}: ${data.step.title}`);
        
        if (this.selectedTestId === data.testId) {
          this.renderTestDetail(data.testId);
        }
      }
    } catch (err) {
      console.error('[Action] Error:', err, data);
    }
  }
  
  handleConsole(data) {
    try {
      if (!this.consoleOutput.has(data.testId)) {
        this.consoleOutput.set(data.testId, []);
      }
      this.consoleOutput.get(data.testId).push({
        stream: data.stream,
        data: data.data,
        timestamp: new Date().toISOString()
      });
      
      if (this.selectedTestId === data.testId) {
        this.renderTestDetail(data.testId);
      }
    } catch (err) {
      console.error('[Console] Error:', err, data);
    }
  }
  
  handleTestCompleted(data) {
    try {
      console.log('[TestCompleted] Processing:', data);
      const test = this.tests.get(data.testId);
      if (test) {
        const result = data.result || {};
        test.status = result.status || 'passed';
        test.duration = result.duration;
        test.errors = data.errors || [];
        
        console.log(`[TestCompleted] Updated test ${data.testId} to ${test.status}`);
        
        this.updateStats();
        this.renderTestList();
        
        if (this.selectedTestId === data.testId) {
          this.renderTestDetail(data.testId);
        }
      }
    } catch (err) {
      console.error('[TestCompleted] Error:', err, data);
    }
  }
  
  updateStats() {
    try {
      this.stats = { total: this.tests.size, passed: 0, failed: 0, running: 0 };
      for (const test of this.tests.values()) {
        if (test.status === 'passed') this.stats.passed++;
        else if (test.status === 'failed') this.stats.failed++;
        else if (test.status === 'running') this.stats.running++;
      }
      
      if (this.elements.statTotal) this.elements.statTotal.textContent = this.stats.total;
      if (this.elements.statPassed) this.elements.statPassed.textContent = this.stats.passed;
      if (this.elements.statFailed) this.elements.statFailed.textContent = this.stats.failed;
      if (this.elements.statRunning) this.elements.statRunning.textContent = this.stats.running;
      
      console.log('[Stats] Updated:', this.stats);
    } catch (err) {
      console.error('[Stats] Error updating stats:', err);
    }
  }
  
  renderTestList() {
    try {
      console.log('[Render] Rendering test list...');
      let tests = Array.from(this.tests.values());
      
      if (this.filter !== 'all') {
        tests = tests.filter(t => t.status === this.filter);
      }
      
      let html = '';
      for (const test of tests) {
        const icon = this.getStatusIcon(test.status);
        const selected = test.testId === this.selectedTestId ? 'selected' : '';
        const duration = test.duration ? this.formatDuration(test.duration) : '';
        
        html += `
          <div class="test-item ${selected}" data-test-id="${test.testId}">
            <div class="test-icon ${test.status}">${icon}</div>
            <div class="test-info">
              <div class="test-title">${this.escape(test.title)}</div>
              <div class="test-meta">${test.browser} ${duration}</div>
            </div>
          </div>
        `;
      }
      
      if (html === '') {
        this.elements.testList.innerHTML = '<p class="empty">No tests</p>';
        return;
      }
      
      this.elements.testList.innerHTML = html;
      
      // Add click handlers
      this.elements.testList.querySelectorAll('.test-item').forEach(el => {
        el.addEventListener('click', () => {
          this.selectedTestId = el.dataset.testId;
          this.renderTestList();
          this.renderTestDetail(el.dataset.testId);
        });
      });
      
      console.log(`[Render] Rendered ${tests.length} tests`);
    } catch (err) {
      console.error('[Render] Error rendering test list:', err);
      this.elements.testList.innerHTML = '<p class="error">Error rendering tests</p>';
    }
  }
  
  renderTestDetail(testId) {
    try {
      console.log(`[Render] Rendering detail for ${testId}`);
      const test = this.tests.get(testId);
      if (!test) {
        console.warn(`[Render] Test not found: ${testId}`);
        this.elements.testDetail.innerHTML = '<p class="error">Test not found</p>';
        return;
      }
      
      const icon = this.getStatusIcon(test.status);
      const tags = (test.tags || []).map(t => `<span class="tag">@${t}</span>`).join('');
      const duration = test.duration ? this.formatDuration(test.duration) : '';
      
      let html = `
        <div class="test-header">
          <h2>
            <span class="test-icon ${test.status}">${icon}</span>
            ${this.escape(test.title)}
          </h2>
          <div class="test-header-meta">
            <span>${test.file}:${test.line}</span>
            <span>${test.browser}</span>
            ${test.workerId !== undefined ? `<span>Worker ${test.workerId}</span>` : ''}
            ${duration ? `<span>${duration}</span>` : ''}
            ${tags}
          </div>
        </div>
        
        <table class="results-table">
          <thead>
            <tr>
              <th class="col-line">Line</th>
              <th class="col-source">Source Code</th>
              <th class="col-status">Status</th>
              <th class="col-result">Result</th>
              <th class="col-duration">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${this.renderTableRows(test)}
          </tbody>
        </table>
      `;
      
      this.elements.testDetail.innerHTML = html;
      console.log(`[Render] Detail rendered for ${testId}`);
    } catch (err) {
      console.error(`[Render] Error rendering detail for ${testId}:`, err);
      this.elements.testDetail.innerHTML = '<p class="error">Error rendering test detail</p>';
    }
  }
  
  renderTableRows(test) {
    try {
      let rows = '';
      
      // Setup
      if (test.setup) {
        rows += `
          <tr class="row-setup">
            <td class="col-line"></td>
            <td class="col-source">Test Setup</td>
            <td class="col-status"><span class="status-icon passed">✓</span></td>
            <td class="col-result">Setup completed</td>
            <td class="col-duration">${this.formatDuration(test.setup.totalDuration)}</td>
          </tr>
        `;
      }
      
      // Source code with steps
      if (test.source) {
        const lines = test.source.split('\n');
        console.log(`[Render] Processing ${lines.length} source lines, ${test.steps.size} steps`);
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lineNum = test.line + i;
          
          // Find matching step for this line
          let matchedStep = null;
          for (const [stepId, step] of test.steps.entries()) {
            if (this.lineMatchesStep(line, step)) {
              matchedStep = step;
              break;
            }
          }
          
          if (matchedStep) {
            const icon = this.getStatusIcon(matchedStep.status || 'pending');
            const duration = matchedStep.duration ? this.formatDuration(matchedStep.duration) : 
                           matchedStep.status === 'running' ? '⏱️ running...' : '';
            const statusClass = matchedStep.status || 'pending';
            
            rows += `
              <tr class="row-step row-${statusClass}">
                <td class="col-line">${lineNum}</td>
                <td class="col-source"><code>${this.escape(line)}</code></td>
                <td class="col-status"><span class="status-icon ${statusClass}">${icon}</span></td>
                <td class="col-result">${this.escape(matchedStep.title)}</td>
                <td class="col-duration">${duration}</td>
              </tr>
            `;
            
            // Show actions
            const actions = test.actions.get(matchedStep.stepId) || [];
            for (const action of actions) {
              rows += `
                <tr class="row-action">
                  <td class="col-line"></td>
                  <td class="col-source"><code>  ${this.escape(action.title)}</code></td>
                  <td class="col-status"><span class="status-icon passed">✓</span></td>
                  <td class="col-result">${this.escape(action.title)}</td>
                  <td class="col-duration">${action.duration ? this.formatDuration(action.duration) : ''}</td>
                </tr>
              `;
            }
          } else {
            // Just source
            rows += `
              <tr class="row-source">
                <td class="col-line">${lineNum}</td>
                <td class="col-source"><code>${this.escape(line)}</code></td>
                <td class="col-status"></td>
                <td class="col-result"></td>
                <td class="col-duration"></td>
              </tr>
            `;
          }
        }
      } else {
        // No source, just show steps
        for (const [stepId, step] of test.steps.entries()) {
          const icon = this.getStatusIcon(step.status || 'pending');
          const duration = step.duration ? this.formatDuration(step.duration) : '';
          const statusClass = step.status || 'pending';
          
          rows += `
            <tr class="row-step row-${statusClass}">
              <td class="col-line">-</td>
              <td class="col-source">${this.escape(step.title)}</td>
              <td class="col-status"><span class="status-icon ${statusClass}">${icon}</span></td>
              <td class="col-result">${this.escape(step.title)}</td>
              <td class="col-duration">${duration}</td>
            </tr>
          `;
        }
      }
      
      return rows;
    } catch (err) {
      console.error('[Render] Error rendering table rows:', err);
      return '<tr><td colspan="5" class="error">Error rendering test steps</td></tr>';
    }
  }
  
  lineMatchesStep(line, step) {
    // Simple matching - look for test.step() calls
    const stepMatch = line.match(/test\.step\(['"]([^'"]+)['"]/);
    if (stepMatch && stepMatch[1] === step.title) {
      return true;
    }
    return false;
  }
  
  getStatusIcon(status) {
    switch (status) {
      case 'passed': return '✓';
      case 'failed': return '✗';
      case 'running': return '●';
      default: return '○';
    }
  }
  
  formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  escape(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// Initialize
console.log('[App] Starting TestViewer...');
new TestViewer();
