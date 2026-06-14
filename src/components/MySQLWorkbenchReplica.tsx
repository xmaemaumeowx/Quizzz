import React, { useState } from 'react';
import { 
  Database, Play, Terminal, Code, Eye, Layers, Settings, TableProperties, 
  Activity, Check, AlertCircle, Copy, HelpCircle, RotateCcw, Sparkles, 
  Code2, BookOpen, ChevronsRight, GitCommit, FileCode, ArrowRight, CornerDownRight, 
  ShieldCheck, ArrowUpRight, Award, Server
} from 'lucide-react';

interface SQLScript {
  id: string;
  category: 'index' | 'view' | 'procedure';
  title: string;
  description: string;
  dialects: {
    mysql: { sql: string; output: string; details: string };
    postgresql: { sql: string; output: string; details: string };
    mssql: { sql: string; output: string; details: string };
  };
}

const PRESET_SCRIPTS: SQLScript[] = [
  {
    id: 'index-create',
    category: 'index',
    title: '1. Create B-Tree Index on Attendance',
    description: 'Enforces an index over employee_id and pay_period_id to optimize frequent join scans into seek algorithms.',
    dialects: {
      mysql: {
        sql: `-- Speed up MotorPH Payroll calculations
-- Creates a secondary B-Tree composite index on foreign key columns
CREATE INDEX idx_attendance_emp_period 
ON motorph_attendance(employee_id, pay_period_id);

-- Verify Index usage using MySQL Explain
EXPLAIN SELECT * FROM motorph_attendance 
WHERE employee_id = 10001 AND pay_period_id = 5;`,
        output: 'Query OK, 0 rows affected (0.04 sec)\nRecords: 0  Duplicates: 0  Warnings: 0\n\n-- Explain Plan Output --\nselect_type: SIMPLE\ntable: motorph_attendance\ntype: ref\npossible_keys: idx_attendance_emp_period\nkey: idx_attendance_emp_period\nkey_len: 8\nref: const,const\nrows: 4\nfiltered: 100.00\nExtra: Using index',
        details: 'MySQL structuralizes this multi-column index using a balanced B+ Tree framework. Instead of performing a Full Table Scan on 24,380 records, lookup jumps directly to index blocks in 2 page Reads.'
      },
      postgresql: {
        sql: `-- PostgreSQL 16 Index configuration
-- Creates a composite B-Tree index (default in Postgres)
CREATE INDEX idx_attendance_emp_period 
ON "Attendance"(employee_id, pay_period_id);

-- Measure lookups directly with real system query plans
EXPLAIN ANALYZE SELECT * FROM "Attendance" 
WHERE employee_id = 10001 AND pay_period_id = 5;`,
        output: 'CREATE INDEX\nTime: 12.45 ms\n\n-- Postgres Plan EXPLAIN ANALYZE --\nIndex Scan using idx_attendance_emp_period on "Attendance"  (cost=0.29..8.31 rows=4 width=40) (actual time=0.042..0.045 rows=4 loops=1)\n  Index Cond: ((employee_id = 10001) AND (pay_period_id = 5))\nPlanning Time: 0.112 ms\nExecution Time: 0.068 ms',
        details: 'Postgres uses B-Tree entries to avoid seq scans. Plan shows cost evaluation from 0.29 pages read up to 8.31 total cost. Execution takes only 0.068 milliseconds.'
      },
      mssql: {
        sql: `-- Microsoft SQL Server T-SQL Option
-- Creates nonclustered index on heap table or clustered index layout
CREATE NONCLUSTERED INDEX idx_attendance_emp_period 
ON Attendance (employee_id, pay_period_id);

-- Set output stream to observe index seek plans as XML or Text
SET SHOWPLAN_TEXT ON;
GO
SELECT * FROM Attendance 
WHERE employee_id = 10001 AND pay_period_id = 5;
GO
SET SHOWPLAN_TEXT OFF;`,
        output: 'Commands completed successfully.\n\n-- Showplan Output --\n|-- Index Seek(OBJECT:(Attendance.idx_attendance_emp_period), SEEK:([employee_id]=10001 AND [pay_period_id]=5))',
        details: 'MSSQL immediately replaces Table Scans with a direct Index Seek operation, executing page allocation searches down the non-clustered index tree root.'
      }
    }
  },
  {
    id: 'view-payroll',
    category: 'view',
    title: '2. Create View for Payroll Summation',
    description: 'Forms a virtual tabular abstraction linking employee profiles, department listings, and gross pay values.',
    dialects: {
      mysql: {
        sql: `-- Secure Salary masking view for MotorPH HR
CREATE OR REPLACE VIEW v_employee_payroll_summary AS
SELECT 
    e.employee_id,
    e.last_name,
    e.first_name,
    d.name AS department_name,
    p.total_workhours,
    p.gross_pay,
    p.total_deductions,
    p.net_pay
FROM Employee e
INNER JOIN Department d ON e.department_id = d.department_id
INNER JOIN Payroll p ON e.employee_id = p.employee_id;

-- Read view like a normal table base
SELECT * FROM v_employee_payroll_summary 
WHERE department_name = 'Engineering' AND net_pay > 30000;`,
        output: 'Query OK, 0 rows affected (0.02 sec)\n\n-- Search Result Set (Sample) --\n10 rows returned in selection search (0.006 sec)',
        details: 'This view functions as a macro statement. It takes no storage. It protects core SSN / government IDs while supplying computed results.'
      },
      postgresql: {
        sql: `-- Postgres highly-optimized relational view
CREATE OR REPLACE VIEW v_employee_payroll_summary AS
SELECT 
    e.employee_id,
    e.last_name,
    e.first_name,
    d.name AS department_name,
    p.total_workhours,
    p.gross_pay,
    p.total_deductions,
    p.net_pay
FROM "Employee" e
INNER JOIN "Department" d ON e.department_id = d.department_id
INNER JOIN "Payroll" p ON e.employee_id = p.employee_id;

-- Query view elements securely
SELECT * FROM v_employee_payroll_summary 
WHERE net_pay > 40000;`,
        output: 'CREATE VIEW\nTime: 8.12 ms\n\n-- Postgres Views Output Sample --\n(4 rows returned)',
        details: 'PostgreSQL records this view into the System Catalog tables. It replaces references dynamically without caching duplicate files unless materialized with indices.'
      },
      mssql: {
        sql: `-- Microsoft SQL SCHEMABINDING View
-- SchemaBinding locks referenced table structures to avoid schema drift
IF OBJECT_ID('dbo.v_employee_payroll_summary', 'V') IS NOT NULL
    DROP VIEW dbo.v_employee_payroll_summary;
GO

CREATE VIEW dbo.v_employee_payroll_summary
WITH SCHEMABINDING
AS
SELECT 
    e.employee_id,
    e.last_name,
    e.first_name,
    d.name AS department_name,
    p.total_workhours,
    p.gross_pay,
    p.total_deductions,
    p.net_pay
FROM dbo.Employee e
INNER JOIN dbo.Department d ON e.department_id = d.department_id
INNER JOIN dbo.Payroll p ON e.employee_id = p.employee_id;
GO

-- Query view
SELECT * FROM dbo.v_employee_payroll_summary WITH (NOEXPAND);`,
        output: 'Commands completed successfully.\n\n-- Views Result Set Sample --\n7 rows returned in view search query.',
        details: 'SCHEMABINDING is useful in MSSQL. It guarantees other admins cannot drop or alter base tables while linked views are active.'
      }
    }
  },
  {
    id: 'procedure-payroll',
    category: 'procedure',
    title: '3. Stored Procedure with Transaction Controls',
    description: 'Implements full transaction safeguards on calculated wages. Restores and rolls back database states if computation triggers exceptions.',
    dialects: {
      mysql: {
        sql: `-- Transaction controlled procedure with input parameters
DELIMITER //

CREATE PROCEDURE CalculateMotorPHNetPay(
    IN p_employee_id INT,
    IN p_pay_period_id INT,
    OUT p_computed_net_pay DECIMAL(15,2)
)
BEGIN
    DECLARE v_gross DECIMAL(15,2);
    DECLARE v_deductions DECIMAL(15,2);
    
    -- Transaction exception error handler
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_computed_net_pay = 0.00;
    END;

    START TRANSACTION;
    
    -- Retrieve gross pay & deduction values
    SELECT COALESCE(gross_pay, 0.00), COALESCE(total_deductions, 0.00)
    INTO v_gross, v_deductions
    FROM Payroll
    WHERE employee_id = p_employee_id AND pay_period_id = p_pay_period_id;
    
    SET p_computed_net_pay = v_gross - v_deductions;
    
    IF p_computed_net_pay < 0.00 THEN
        -- Force exception to trigger Rollback handler
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Calculation Rule Aborted: Negative wage bounds';
    ELSE
        UPDATE Payroll 
        SET net_pay = p_computed_net_pay, payroll_status = 'paid'
        WHERE employee_id = p_employee_id AND pay_period_id = p_pay_period_id;
        
        COMMIT;
    END IF;
END //

DELIMITER ;`,
        output: 'Query OK, 0 rows affected (0.05 sec)\n\n-- Call sample --\nCALL CalculateMotorPHNetPay(1001, 5, @net_pay);\nSELECT @net_pay AS FinalNetSalary;',
        details: 'MySQL compiles this block into internal binary layouts. Network latency is eliminated, and SQL injections are blocked using prepared arguments.'
      },
      postgresql: {
        sql: `-- Postgres PL/pgSQL secure Transaction Procedure
CREATE OR REPLACE PROCEDURE calculate_motorph_net_pay(
    p_employee_id INT,
    p_pay_period_id INT,
    INOUT p_computed_net_pay DECIMAL(15,2) DEFAULT 0.00
)
LANGUAGE plpgsql AS $$
DECLARE
    v_gross DECIMAL(15,2);
    v_deductions DECIMAL(15,2);
BEGIN
    -- Query values of gross and deductions
    SELECT COALESCE(gross_pay, 0.00), COALESCE(total_deductions, 0.00)
    INTO v_gross, v_deductions
    FROM "Payroll"
    WHERE employee_id = p_employee_id AND pay_period_id = p_pay_period_id;

    p_computed_net_pay := v_gross - v_deductions;

    IF p_computed_net_pay < 0 THEN
        -- Raise exception to rollback transaction automagically outside
        RAISE EXCEPTION 'Negative computed net pay for MotorPH candidate ID %', p_employee_id;
    ELSE
        UPDATE "Payroll"
        SET net_pay = p_computed_net_pay, payroll_status = 'paid'
        WHERE employee_id = p_employee_id AND pay_period_id = p_pay_period_id;
    END IF;
END;
$$;`,
        output: 'CREATE PROCEDURE\nTime: 14.15 ms\n\n-- Run sample --\nCALL calculate_motorph_net_pay(1001, 5);',
        details: 'In PL/pgSQL, procedures are transactionally secure. If a step fails, the server rolls back automatically. It is compiled and cached on startup.'
      },
      mssql: {
        sql: `-- T-SQL Stored Procedure with TRY/CATCH Rollbacks
CREATE PROCEDURE dbo.CalculateMotorPHNetPay
    @p_employee_id INT,
    @p_pay_period_id INT,
    @p_computed_net_pay DECIMAL(15,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @v_gross DECIMAL(15,2);
    DECLARE @v_deductions DECIMAL(15,2);

    BEGIN TRANSACTION;
    BEGIN TRY
        SELECT @v_gross = COALESCE(gross_pay, 0.00), 
               @v_deductions = COALESCE(total_deductions, 0.00)
        FROM dbo.Payroll
        WHERE employee_id = @p_employee_id AND pay_period_id = @p_pay_period_id;

        SET @p_computed_net_pay = @v_gross - @v_deductions;

        IF @p_computed_net_pay < 0.00
        BEGIN
            THROW 51000, 'Wage Calculation Limit Exception: Negatives computed', 1;
        END

        UPDATE dbo.Payroll
        SET net_pay = @p_computed_net_pay, payroll_status = 'paid'
        WHERE employee_id = @p_employee_id AND pay_period_id = @p_pay_period_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        SET @p_computed_net_pay = 0.00;
        THROW;
    END CATCH
END;
GO`,
        output: 'Commands completed successfully.\n\n-- Execution Call --\nDECLARE @out_pay DECIMAL(15,2);\nEXEC dbo.CalculateMotorPHNetPay @p_employee_id=1001, @p_pay_period_id=5, @p_computed_net_pay=@out_pay OUTPUT;\nSELECT @out_pay as SalaryOut;',
        details: 'MSSQL T-SQL uses @@TRANCOUNT and structured TRY CATCH loops. Transactions are committed only if no database state warnings are raised.'
      }
    }
  }
];

export default function MySQLWorkbenchReplica() {
  const [activeTab, setActiveTab] = useState<'editor' | 'schema' | 'benchmark'>('editor');
  const [dialect, setDialect] = useState<'mysql' | 'postgresql' | 'mssql'>('mysql');
  const [activePresetId, setActivePresetId] = useState<string>('index-create');
  
  // Script content managed relative to selected preset and dialect
  const getScriptForSelection = (presetId: string, d: 'mysql' | 'postgresql' | 'mssql') => {
    const p = PRESET_SCRIPTS.find(item => item.id === presetId);
    return p ? p.dialects[d].sql : '';
  };

  const getOutputForSelection = (presetId: string, d: 'mysql' | 'postgresql' | 'mssql') => {
    const p = PRESET_SCRIPTS.find(item => item.id === presetId);
    return p ? p.dialects[d].output : '';
  };

  const getDetailsForSelection = (presetId: string, d: 'mysql' | 'postgresql' | 'mssql') => {
    const p = PRESET_SCRIPTS.find(item => item.id === presetId);
    return p ? p.dialects[d].details : '';
  };

  const [editorOverrideText, setEditorOverrideText] = useState<string | null>(null);
  const currentScriptText = editorOverrideText !== null ? editorOverrideText : getScriptForSelection(activePresetId, dialect);

  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '-- SQL Database Workbench Simulator Active --',
    'Connected to: [Local Sandbox Engine Pool]',
    'Active Database Target: `motorph_payroll_db`',
    'Click on any Academic recipe on the left to review indexing, view abstractions, or procedure security layouts.'
  ]);

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [queryResultContent, setQueryResultContent] = useState<string>('No statement executed yet. Choose a statement and press ⚡ Execute.');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Schema state persistence
  const [indexCreated, setIndexCreated] = useState<boolean>(false);
  const [viewCreated, setViewCreated] = useState<boolean>(false);
  const [procedureCreated, setProcedureCreated] = useState<boolean>(false);

  // Speed profiler benchmarks
  const [tableScanTime, setTableScanTime] = useState(148.5); // ms
  const [indexSeekTime, setIndexSeekTime] = useState(1.8); // ms
  const [isTestingBench, setIsTestingBench] = useState(false);

  // Interactive Schema Diagram selection
  const [selectedSchemaSection, setSelectedSchemaSection] = useState<'rbac' | 'employee' | 'accounting'>('rbac');
  const [selectedDbTable, setSelectedDbTable] = useState<string>('User');

  const executeSQL = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      let outputText = getOutputForSelection(activePresetId, dialect);
      if (editorOverrideText !== null) {
        outputText = `-- Custom execution completed successfully over ${dialect.toUpperCase()} engine --\nAffected Rows: 1. Schema updated inside virtualization container.`;
      }

      if (activePresetId === 'index-create') {
        setIndexCreated(true);
      } else if (activePresetId === 'view-payroll') {
        setViewCreated(true);
      } else {
        setProcedureCreated(true);
      }

      setQueryResultContent(outputText);
      setConsoleLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Executed statement on ${dialect.toUpperCase()} cluster.`,
        `>> Action: SUCCESS. Catalog dictionary refreshed successfully.`
      ]);
    }, 600);
  };

  const handleDialectChange = (newDialect: 'mysql' | 'postgresql' | 'mssql') => {
    setDialect(newDialect);
    setEditorOverrideText(null); // Reset overrides to default preset codes
    setQueryResultContent('SQL Dialect changed. Execute script to view dialect-specific compilations.');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentScriptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const resetEngine = () => {
    setIndexCreated(false);
    setViewCreated(false);
    setProcedureCreated(false);
    setEditorOverrideText(null);
    setConsoleLogs([
      '-- Schema context has been cleared. Pointers released. --',
      'Virtual tables dropped. Re-execute scripts to initialize structural setups.'
    ]);
    setQueryResultContent('Engine catalog dropped. Workspace clean.');
  };

  // Run benchmark test simulation
  const runBenchmarkTest = () => {
    setIsTestingBench(true);
    setTimeout(() => {
      setIsTestingBench(false);
      setConsoleLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Query throughput execution test finished over ${dialect.toUpperCase()}.`,
        `>> Non-indexed query read cost: 8.21GFlops (Full table Scan)`,
        `>> Composite Index B-Tree lookup cost: 0.04GFlops (Instant index SEEK)`
      ]);
    }, 1300);
  };

  // SCHEMA DIAGRAM RAW TABLES CORRESPONDING TO THE 3 DIAGRAMS GIVEN
  const TABLES_CATALOG = {
    rbac: [
      {
        name: 'User',
        desc: 'Security credential definitions referencing individual employee records.',
        columns: [
          { name: 'user_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'username', type: 'VARCHAR(50)', extra: 'UNIQUE, NOT NULL' },
          { name: 'password_hash', type: 'VARCHAR(60)', extra: 'NOT NULL' },
          { name: 'created_date', type: 'DATETIME', extra: 'NOT NULL' },
          { name: 'last_modified', type: 'DATETIME', extra: 'NULL' },
          { name: 'employee_id', type: 'INT', extra: 'FOREIGN KEY' }
        ]
      },
      {
        name: 'Role',
        desc: 'System permissions hierarchies (e.g. HR Admin, Supervisor, Auditor).',
        columns: [
          { name: 'role_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'role_name', type: 'VARCHAR(50)', extra: 'UNIQUE, NOT NULL' },
          { name: 'description', type: 'TEXT', extra: 'NULL' },
          { name: 'created_date', type: 'DATETIME', extra: 'NOT NULL' },
          { name: 'last_modified', type: 'DATETIME', extra: 'NULL' }
        ]
      },
      {
        name: 'User_Role',
        desc: 'Associative bridge mapping users to roles (Many-to-Many).',
        columns: [
          { name: 'user_id', type: 'INT', extra: 'COMPOSITE PK, FOREIGN KEY' },
          { name: 'role_id', type: 'INT', extra: 'COMPOSITE PK, FOREIGN KEY' }
        ]
      },
      {
        name: 'Permission',
        desc: 'Explicit execution bounds and object authorizations.',
        columns: [
          { name: 'permission_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'permission_name', type: 'VARCHAR(50)', extra: 'UNIQUE, NOT NULL' },
          { name: 'description', type: 'TEXT', extra: 'NULL' },
          { name: 'action', type: 'ENUM', extra: '(Create, Read, Update, Delete)' },
          { name: 'record', type: 'ENUM', extra: '(Employee, Position, Timesheet, Payroll, Leave, etc)' },
          { name: 'scope', type: 'ENUM', extra: '(Own record, Department-wide, Subordinate, etc)' }
        ]
      },
      {
        name: 'Role_Permission',
        desc: 'Associative mapping table bridging permissions with role structures.',
        columns: [
          { name: 'role_id', type: 'INT', extra: 'COMPOSITE PK, FOREIGN KEY' },
          { name: 'permission_id', type: 'INT', extra: 'COMPOSITE PK, FOREIGN KEY' }
        ]
      }
    ],
    employee: [
      {
        name: 'Employee',
        desc: 'Primal system entity mapping personnel records.',
        columns: [
          { name: 'employee_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'last_name', type: 'VARCHAR(50)', extra: 'NOT NULL' },
          { name: 'first_name', type: 'VARCHAR(50)', extra: 'NOT NULL' },
          { name: 'dob', type: 'DATE', extra: 'NOT NULL' },
          { name: 'phone_number', type: 'VARCHAR(20)', extra: 'NULL' },
          { name: 'supervisor_id', type: 'INT', extra: 'FOREIGN KEY (Self-Reference)' },
          { name: 'status_id', type: 'INT', extra: 'FOREIGN KEY' },
          { name: 'position_id', type: 'INT', extra: 'FOREIGN KEY' },
          { name: 'department_id', type: 'INT', extra: 'FOREIGN KEY' }
        ]
      },
      {
        name: 'Gov_ID',
        desc: 'Compulsory regulatory unique identification details.',
        columns: [
          { name: 'gov_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'ssn', type: 'VARCHAR(15)', extra: 'UNIQUE' },
          { name: 'tin', type: 'VARCHAR(15)', extra: 'UNIQUE' },
          { name: 'phic', type: 'VARCHAR(15)', extra: 'UNIQUE' },
          { name: 'hdmf', type: 'VARCHAR(15)', extra: 'UNIQUE' },
          { name: 'employee_id', type: 'INT', extra: 'FOREIGN KEY' }
        ]
      },
      {
        name: 'Address',
        desc: 'Physical address registries matching personnel database rows.',
        columns: [
          { name: 'address_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'street', type: 'VARCHAR(55)', extra: 'NOT NULL' },
          { name: 'barangay', type: 'VARCHAR(45)', extra: 'NOT NULL' },
          { name: 'city', type: 'VARCHAR(45)', extra: 'NOT NULL' },
          { name: 'province', type: 'VARCHAR(45)', extra: 'NOT NULL' },
          { name: 'zipcode', type: 'VARCHAR(10)', extra: 'NOT NULL' }
        ]
      },
      {
        name: 'Department',
        desc: 'Organizational division matrices of the corporation.',
        columns: [
          { name: 'department_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'name', type: 'VARCHAR(50)', extra: 'NOT NULL' },
          { name: 'description', type: 'TEXT', extra: 'NULL' }
        ]
      },
      {
        name: 'Position',
        desc: 'Corporate rankings, grades, and gross base salaries.',
        columns: [
          { name: 'position_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'name', type: 'VARCHAR(50)', extra: 'NOT NULL' },
          { name: 'description', type: 'VARCHAR(255)', extra: 'NULL' },
          { name: 'basic_salary', type: 'INT', extra: 'NOT NULL' },
          { name: 'department_id', type: 'INT', extra: 'FOREIGN KEY' }
        ]
      }
    ],
    accounting: [
      {
        name: 'Attendance',
        desc: 'Biometric scan registers storing logs of actual hours worked.',
        columns: [
          { name: 'attendance_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'time_in', type: 'TIMESTAMP', extra: 'NOT NULL' },
          { name: 'time_out', type: 'TIMESTAMP', extra: 'NULL' },
          { name: 'status', type: 'VARCHAR(25)', extra: 'NOT NULL' },
          { name: 'employee_id', type: 'INT', extra: 'FOREIGN KEY' },
          { name: 'pay_period_id', type: 'INT', extra: 'FOREIGN KEY' }
        ]
      },
      {
        name: 'Overtime',
        desc: 'Overtime pre-approval tickets linked with hour rates.',
        columns: [
          { name: 'overtime_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'hours_approved', type: 'INT', extra: 'NOT NULL' },
          { name: 'approver_id', type: 'INT', extra: 'FOREIGN KEY' },
          { name: 'status', type: 'VARCHAR(25)', extra: 'NOT NULL' },
          { name: 'remarks', type: 'VARCHAR(50)', extra: 'NULL' },
          { name: 'attendance_id', type: 'INT', extra: 'FOREIGN KEY' }
        ]
      },
      {
        name: 'Payroll',
        desc: 'Payroll computation structures containing computed net incomes.',
        columns: [
          { name: 'payroll_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'employee_id', type: 'INT', extra: 'FOREIGN KEY' },
          { name: 'pay_period_id', type: 'INT', extra: 'FOREIGN KEY' },
          { name: 'total_workhours', type: 'DECIMAL(15,2)', extra: 'NOT NULL' },
          { name: 'total_deductions', type: 'DECIMAL(15,2)', extra: 'NOT NULL' },
          { name: 'w_tax', type: 'DECIMAL(15,2)', extra: 'NOT NULL' },
          { name: 'total_benefits', type: 'DECIMAL(15,2)', extra: 'NOT NULL' },
          { name: 'gross_pay', type: 'DECIMAL(15,2)', extra: 'NOT NULL' },
          { name: 'net_pay', type: 'DECIMAL(15,2)', extra: 'NOT NULL' },
          { name: 'payroll_status', type: 'ENUM', extra: '(Draft, Paid)' }
        ]
      },
      {
        name: 'Pay_Period',
        desc: 'Semi-monthly start & release accounting periods.',
        columns: [
          { name: 'pay_period_id', type: 'INT', extra: 'PRIMARY KEY' },
          { name: 'start_date', type: 'DATE', extra: 'NOT NULL' },
          { name: 'end_date', type: 'DATE', extra: 'NOT NULL' }
        ]
      }
    ]
  };

  const getTablesForSelectedSection = () => {
    return TABLES_CATALOG[selectedSchemaSection] || [];
  };

  const getCurrentTableObj = () => {
    const tableList = getTablesForSelectedSection();
    return tableList.find(t => t.name === selectedDbTable) || tableList[0] || TABLES_CATALOG.rbac[0];
  };

  return (
    <div className="bg-[#10101a] text-slate-100 rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between" id="mysql-workbench-replica">
      
      {/* WINDOW TITLE BAR CHROME */}
      <div className="bg-[#0b0b12] px-6 py-4 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-vibrant-red inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-vibrant-gold inline-block" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#00e1cf] inline-block" />
          </div>
          <span className="text-white/20 font-light pl-2">|</span>
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-vibrant-gold" />
            <h2 className="font-black text-xs md:text-sm tracking-widest text-[#f29111] uppercase">Enterprise SQL Database Sandbox</h2>
          </div>
        </div>

        {/* DIALECT SELECTOR TABS */}
        <div className="flex items-center space-x-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => handleDialectChange('mysql')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
              dialect === 'mysql' 
                ? 'bg-[#00758f] text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>MySQL 8.0 CE</span>
          </button>
          
          <button
            onClick={() => handleDialectChange('postgresql')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
              dialect === 'postgresql' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>PostgreSQL 16</span>
          </button>

          <button
            onClick={() => handleDialectChange('mssql')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1.5 cursor-pointer ${
              dialect === 'mssql' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>MSSQL Server (T-SQL)</span>
          </button>
        </div>
      </div>

      {/* VIEW TABS SELECTOR HEADERS */}
      <div className="bg-[#141424] border-b border-white/5 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex bg-black/40 p-1 rounded-xl text-xs font-bold border border-white/5 space-x-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'editor' 
                ? 'bg-vibrant-gold text-slate-950 font-black shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Interactive SQL Scripting</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('schema');
              // Automatically match section reset
              setSelectedSchemaSection('rbac');
              setSelectedDbTable('User');
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'schema' 
                ? 'bg-vibrant-gold text-slate-950 font-black shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>MotorPH Visual Schema Roster</span>
            {(indexCreated || viewCreated || procedureCreated) && (
              <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'benchmark' 
                ? 'bg-vibrant-gold text-slate-950 font-black shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Engine Performance Benchmark</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={resetEngine}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[10px] font-black cursor-pointer uppercase transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Cache Engine</span>
          </button>
          <span className="text-gray-400 font-mono text-[10px] hidden sm:inline">Context: <span className="text-emerald-400 font-black">Connected</span></span>
        </div>
      </div>

      {/* CORE SPLITTER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[550px]">
        
        {/* LEFT WORKBOOK BAR - 4 cols */}
        <div className="lg:col-span-4 bg-[#0d0d15] border-r border-white/5 p-5 space-y-5">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-vibrant-gold flex items-center space-x-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-vibrant-gold" />
              <span>Interactive SQL Lab Workbook</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Explore how database operations handle the corporate tables inside the MotorPH payload model.
            </p>
          </div>

          {/* PRESENTS LISTINGS */}
          <div className="space-y-3">
            {PRESET_SCRIPTS.map((script) => {
              const isSelected = activePresetId === script.id;
              let isDone = false;
              if (script.id === 'index-create') isDone = indexCreated;
              if (script.id === 'view-payroll') isDone = viewCreated;
              if (script.id === 'procedure-payroll') isDone = procedureCreated;

              return (
                <button
                  key={script.id}
                  onClick={() => {
                    setActivePresetId(script.id);
                    setEditorOverrideText(null); // Load clean preset script
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected 
                      ? 'border-vibrant-gold bg-vibrant-gold/5 shadow-[0_0_15px_rgba(255,204,0,0.06)]' 
                      : 'border-white/5 bg-white/2 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      script.category === 'index' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      script.category === 'view' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {script.category} Setup
                    </span>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${
                      isDone 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-white/5 text-slate-400 border-white/5'
                    }`}>
                      {isDone ? 'Compiled ✓' : 'Pending Compile'}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-[12px] font-black text-white leading-snug">
                      {script.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1">
                      {script.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-[#141424] border border-white/10 rounded-2xl p-4 space-y-2">
            <span className="text-[9px] font-black uppercase text-[#f29111] tracking-widest block flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#f29111]" />
              <span>SQL Normalization Principles</span>
            </span>
            <ul className="text-[10px] text-slate-300 space-y-1.5 list-disc pl-3">
              <li><b>1NF:</b> Every cellular record holds atomic single values (No listing tables).</li>
              <li><b>2NF:</b> All column properties rely directly on whole primary keys (Removed duplicate groupings).</li>
              <li><b>3NF:</b> Columns only rely on primary keys directly without transitive columns (Split Departments and Positions).</li>
            </ul>
          </div>
        </div>

        {/* RIGHT INTERACTIVE CONTENT SHELF - 8 cols */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#111119]">
          
          {/* TAB 1: CODE EDITOR */}
          {activeTab === 'editor' && (
            <div className="flex-grow flex flex-col justify-between" id="workbench-editor-view">
              
              {/* Actual code writing container */}
              <div className="border-b border-white/5 relative">
                <div className="absolute top-3 right-4 z-20 flex items-center space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a2e] hover:bg-[#252542] border border-white/10 text-[10px] text-slate-300 font-extrabold tracking-wider transition-all uppercase cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Script'}</span>
                  </button>
                  
                  <button
                    onClick={executeSQL}
                    disabled={isExecuting}
                    className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-vibrant-gold text-slate-950 hover:brightness-115 disabled:opacity-50 font-black text-[10px] tracking-widest uppercase transition-all shadow-md cursor-pointer"
                  >
                    <Play className="w-3" />
                    <span>{isExecuting ? 'Compiling...' : 'Execute SQL'}</span>
                  </button>
                </div>

                <div className="p-3 bg-[#08080f] border-b border-white/5 text-[11px] text-slate-400 font-mono flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-[#f29111]" />
                  <span>Target SQL dialect: <span className="text-white font-extrabold uppercase">{dialect}</span></span>
                </div>

                <div className="flex font-mono text-[12px] bg-[#09090f] overflow-x-auto select-text min-h-[260px]">
                  {/* Line identifiers numbers */}
                  <div className="bg-[#05050a] text-slate-600 py-3 text-right select-none pr-3.5 pl-4 border-r border-white/5 space-y-0.5">
                    {Array.from({ length: Math.max(14, currentScriptText.split('\n').length + 3) }).map((_, i) => (
                      <span key={i} className="block text-right w-5 text-[10px]">{i + 1}</span>
                    ))}
                  </div>

                  <textarea
                    value={currentScriptText}
                    onChange={(e) => setEditorOverrideText(e.target.value)}
                    className="flex-grow bg-transparent text-slate-200 p-4 outline-none resize-none font-mono leading-relaxed h-[300px] w-full focus:ring-0 focus:border-transparent text-xs"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Bottom twin execution results panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/5 bg-[#0e0e16]">
                
                {/* Result grid view */}
                <div className="border-r border-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase text-slate-350 tracking-wider flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-[#00758f]" />
                      <span>Result Schema Output</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[9px]">Query feedback status</span>
                  </div>

                  <div className="bg-black/40 rounded-xl p-3 border border-white/5 h-[130px] overflow-auto select-text">
                    <pre className="font-mono text-[10px] text-zinc-300 whitespace-pre-wrap leading-relaxed select-text">
                      {queryResultContent}
                    </pre>
                  </div>
                </div>

                {/* Database Execution explanation insights */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black uppercase text-slate-350 tracking-wider flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-vibrant-gold" />
                      <span>Schema Roster Impact Explain</span>
                    </span>
                    <span className="text-emerald-400 text-[10px] font-black">Interactive</span>
                  </div>

                  <div className="bg-black/30 rounded-xl p-3.5 border border-white/5 h-[130px] flex flex-col justify-center text-xs">
                    <p className="font-black text-slate-200 text-[11px] mb-1">
                      {activePresetId === 'index-create' ? '🔍 Optimization of Index Seek keys:' : 
                       activePresetId === 'view-payroll' ? '👁️ Dynamic Virtual Relaying logic:' :
                       '🔐 Transaction Safeguard ACID Loop:'}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      {getDetailsForSelection(activePresetId, dialect)}
                    </p>
                    <div className="text-[10px] text-vibrant-gold font-bold mt-2 font-mono flex items-center space-x-1.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Try switching dialects on top to compare Postgres or SQL Server syntax plans!</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: VISUAL DATABASE INSPECTION TAB (MotorPH normalized database visual mapping) */}
          {activeTab === 'schema' && (
            <div className="p-6 space-y-6 flex-grow overflow-y-auto" id="workbench-schema-view">
              
              <div className="bg-[#161626] border border-white/10 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-vibrant-gold uppercase tracking-widest flex items-center space-x-1.5">
                      <Database className="w-4 h-4 text-vibrant-gold" />
                      <span>MotorPH Normalized Catalog Maps</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Explore the actual corporate database structure, normalized to the third normal form (3NF).
                    </p>
                  </div>

                  {/* Schema category picker buttons */}
                  <div className="flex bg-black/60 p-1 rounded-xl border border-white/5 text-[10px] font-black">
                    <button
                      onClick={() => {
                        setSelectedSchemaSection('rbac');
                        setSelectedDbTable('User');
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedSchemaSection === 'rbac' ? 'bg-[#f29111] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Auth & RBAC
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSchemaSection('employee');
                        setSelectedDbTable('Employee');
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedSchemaSection === 'employee' ? 'bg-[#f29111] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Employee Profile
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSchemaSection('accounting');
                        setSelectedDbTable('Attendance');
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedSchemaSection === 'accounting' ? 'bg-[#f29111] text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sched & Accounting
                    </button>
                  </div>
                </div>

                {/* Normalization indicator highlights */}
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1.5 text-[11px]">
                  <span className="font-extrabold text-white block text-[10px] uppercase tracking-wider flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-[#00e1cf]" />
                    <span>Applied Normalization (Diagram {selectedSchemaSection === 'rbac' ? '1' : selectedSchemaSection === 'employee' ? '2' : '3'})</span>
                  </span>
                  <p className="text-slate-350 leading-relaxed text-[10px]">
                    {selectedSchemaSection === 'rbac' && '1NF verified (atomic columns user_id, username representation). 2NF completed (Role / Permission tables bridge maps). 3NF applied (No transitive dependencies between usernames and permission titles).'}
                    {selectedSchemaSection === 'employee' && '1NF applies atomic fields. 2NF separates Gov_ID and Address metrics out of main Employee rows, eliminating Null values. 3NF removes department/positions duplication to separate catalogs.'}
                    {selectedSchemaSection === 'accounting' && '1NF guarantees individual attendance timestamps. 2NF links keys safely. 3NF divides Payroll entries from calculated Deduction brackets, leaving no redundant computed details.'}
                  </p>
                </div>

                {/* Table List selection grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                  
                  {/* Left Table Names */}
                  <div className="lg:col-span-4 space-y-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-450 block px-1">Select table definition</span>
                    {getTablesForSelectedSection().map((t) => (
                      <button
                        key={t.name}
                        onClick={() => setSelectedDbTable(t.name)}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          selectedDbTable === t.name 
                            ? 'bg-vibrant-gold/5 border-vibrant-gold text-white font-extrabold shadow-sm'
                            : 'bg-white/2 border-white/5 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <TableProperties className="w-3.5 h-3.5 text-vibrant-gold" />
                          <span>{t.name}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">({t.columns.length})</span>
                      </button>
                    ))}
                  </div>

                  {/* Right Table Column Specs */}
                  <div className="lg:col-span-8 bg-[#10101f] border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-500 font-mono block">Selected table configuration</span>
                        <h5 className="text-sm font-black text-white flex items-center space-x-1.5">
                          <span>{getCurrentTableObj().name}</span>
                        </h5>
                      </div>
                      <span className="text-[10px] text-vibrant-gold font-black bg-vibrant-gold/15 border border-vibrant-gold/20 px-2 py-0.5 rounded-full">
                        3NF Verified
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-350 leading-relaxed font-sans">{getCurrentTableObj().desc}</p>

                    {/* Columns Properties List */}
                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="grid grid-cols-12 text-slate-400 font-black border-b border-white/5 pb-1 uppercase text-[10px] tracking-wide">
                        <span className="col-span-4">Column Name</span>
                        <span className="col-span-4">Type Data</span>
                        <span className="col-span-4">Constraint Limits</span>
                      </div>

                      {getCurrentTableObj().columns.map((col, idx) => (
                        <div key={idx} className="grid grid-cols-12 text-slate-200 border-b border-white/2 py-1 items-center">
                          <span className="col-span-4 font-extrabold text-vibrant-gold flex items-center space-x-1">
                            {col.extra.includes('PRIMARY KEY') && <span className="text-[9px] text-amber-500 mr-0.5">🔑</span>}
                            {col.extra.includes('FOREIGN KEY') && <span className="text-[9px] text-[#00e1cf] mr-0.5">🔗</span>}
                            <span>{col.name}</span>
                          </span>
                          <span className="col-span-4 text-emerald-400 font-semibold">{col.type}</span>
                          <span className="col-span-4 text-slate-400 text-[10px]">{col.extra}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dynamic state modifiers visual markers */}
                    <div className="bg-[#141424] p-3 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Active compiled references:</span>
                      <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                        <span className="bg-[#00758f]/10 text-[#00758f] border border-[#00758f]/20 px-2 py-0.5 rounded">Primary Key constraints active</span>
                        {indexCreated && getCurrentTableObj().name === 'Attendance' && (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded animate-pulse font-extrabold">idx_attendance_emp_period seeking on B-Tree ✓</span>
                        )}
                        {viewCreated && selectedSchemaSection === 'accounting' && (
                          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded font-extrabold">v_employee_payroll_summary view is active ✓</span>
                        )}
                        {procedureCreated && selectedSchemaSection === 'accounting' && (
                          <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-extrabold">CalculateMotorPHNetPay procedure built ✓</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: INDEX SPEED PROFILER */}
          {activeTab === 'benchmark' && (
            <div className="p-6 space-y-6 flex-grow overflow-y-auto" id="workbench-benchmark-view">
              
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-5 h-5 text-vibrant-gold" />
                  <span>Real-time Query Latency Profiler Check</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Observe and evaluate engine execution latencies on database lookups before and after compiling multi-column index keys.
                </p>
              </div>

              <div className="bg-[#161626] rounded-2xl p-6 border border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                
                <div className="space-y-4">
                  <h5 className="text-sm font-black text-slate-100 uppercase tracking-wide">Dialect Benchmark Optimizer</h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Without structured composite index nodes, seeking specific attendance tickets queries forces the target SQL engine (<b>{dialect.toUpperCase()}</b>) to execute a Full Scan over all physical data partitions.
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By compiling indices, database page allocations arrange search algorithms structurally. Lookups execute in micro-seconds!
                  </p>

                  <button
                    onClick={runBenchmarkTest}
                    disabled={isTestingBench}
                    className="py-3 px-5 rounded-xl bg-vibrant-gold text-slate-950 font-black text-xs shadow-md transition-all uppercase tracking-widest cursor-pointer hover:brightness-110 disabled:opacity-50"
                  >
                    {isTestingBench ? 'Benchmarking Query Engine...' : 'Run Performance Profiler speed test'}
                  </button>
                </div>

                {/* GRAPHIC PERFORMANCE VIEW */}
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-4">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Query Execution Latency (1 scan)</span>
                  
                  {/* Table scan speed metrics */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-red-400">Full Table Scan (Heaps & scan)</span>
                      <span>{tableScanTime} ms</span>
                    </div>
                    <div className="w-full bg-[#1b1b2f] h-3.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: isTestingBench ? '15%' : '100%' }} />
                    </div>
                  </div>

                  {/* Index Seek speed metrics */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <span>B+ Tree Index SEEK</span>
                        {indexCreated && <span className="text-[9px] bg-emerald-500/20 px-1 py-0.2 rounded font-black uppercase animate-pulse">compiled</span>}
                      </span>
                      <span>{indexSeekTime} ms</span>
                    </div>
                    <div className="w-full bg-[#1b1b2f] h-3.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full transition-all duration-1000" style={{ width: isTestingBench ? '1%' : '1.3%' }} />
                    </div>
                  </div>

                  <div className="text-[10px] text-center pt-2 text-slate-350 leading-relaxed">
                    {indexCreated ? (
                      <span className="text-emerald-400 font-extrabold flex items-center justify-center space-x-1">
                        <Check className="w-3.5 h-3.5 animate-bounce" />
                        <span>Indexed compiled! Queries are currently executing 82.5x faster over local records memory!</span>
                      </span>
                    ) : (
                      <span>Perform the speed test first. Go to <b>SQL Query Editor</b> tab and compile the Index to activate real-time seeking maps.</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Warnings details cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                
                <div className="bg-[#151528] border border-white/5 rounded-2xl p-4 space-y-1.5">
                  <span className="font-extrabold text-[#f29111] text-[11px] uppercase tracking-wide block">1. Speed vs Disk Cost</span>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Every secondary index uses memory blocks to maintain seeking structures. Limit redundant composite keys inside enterprise servers.
                  </p>
                </div>

                <div className="bg-[#151528] border border-white/5 rounded-2xl p-4 space-y-1.5">
                  <span className="font-extrabold text-[#f29111] text-[11px] uppercase tracking-wide block">2. Decreased Write Rates</span>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Each INSERT or DELETE forces the system engine to rebuild tree pointers dynamically. Unprincipled indexing slows down data persistence speed.
                  </p>
                </div>

                <div className="bg-[#151528] border border-white/5 rounded-2xl p-4 space-y-1.5">
                  <span className="font-extrabold text-[#f29111] text-[11px] uppercase tracking-wide block">3. Standardizing execution logs</span>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    Enforcing stored procedures keeps analytical algorithms compiled local to the core engines, shielding tables from browser SQL injections.
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* BOTTOM TERMINAL SHELF OUT */}
          <div className="bg-[#05050b] border-t border-white/10 p-4">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase tracking-widest pb-2 mb-2 border-b border-white/5">
              <span className="flex items-center space-x-1.5 text-vibrant-gold">
                <Terminal className="w-3.5 h-3.5 text-[#00e1cf]" />
                <span>Console Logs Terminal &middot; SQL Engine</span>
              </span>
              <span>Online Client</span>
            </div>

            <div className="max-h-[90px] overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1 pr-1 scrollbar-thin scrollbar-thumb-white/15">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith('>>') ? 'text-[#00e1cf] pl-3.5 font-bold' : 'text-slate-300'}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
