import { Quiz } from '../types';

export const PREBAKED_QUIZZES: Quiz[] = [
  {
    id: 'space-quiz',
    title: 'Space & Astronomy Trivia',
    description: 'Test your knowledge about the solar system, planets, stars, and galaxies!',
    category: 'Science',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'space-q1',
        text: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctOptionIndex: 1,
        timeLimit: 15
      },
      {
        id: 'space-q2',
        text: 'What is the hottest planet in our solar system?',
        options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
        correctOptionIndex: 1,
        timeLimit: 15
      },
      {
        id: 'space-q3',
        text: 'What is the name of the galaxy we live in?',
        options: ['Andromeda', 'Milky Way', 'Sombrero Galaxy', 'Triangulum'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'space-q4',
        text: 'How many planets in our solar system have rings?',
        options: ['1', '2', '3', '4'],
        correctOptionIndex: 3, // Jupiter, Saturn, Uranus, Neptune all have rings!
        timeLimit: 20
      },
      {
        id: 'space-q5',
        text: 'Which is the largest planet in our solar system?',
        options: ['Saturn', 'Uranus', 'Jupiter', 'Neptune'],
        correctOptionIndex: 2,
        timeLimit: 15
      }
    ]
  },
  {
    id: 'geography-quiz',
    title: 'World Capitals Challenge',
    description: 'Are you a geography wizard? Identify the correct capitals of countries around the world.',
    category: 'Geography',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'geo-q1',
        text: 'What is the capital city of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctOptionIndex: 2,
        timeLimit: 15
      },
      {
        id: 'geo-q2',
        text: 'Which of the following cities is the capital of Japan?',
        options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
        correctOptionIndex: 2,
        timeLimit: 10
      },
      {
        id: 'geo-q3',
        text: 'What is the capital city of Canada?',
        options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
        correctOptionIndex: 3,
        timeLimit: 15
      },
      {
        id: 'geo-q4',
        text: 'Which city serves as the capital of Brazil?',
        options: ['Rio de Janeiro', 'Brasilia', 'São Paulo', 'Salvador'],
        correctOptionIndex: 1,
        timeLimit: 15
      },
      {
        id: 'geo-q5',
        text: 'What is the capital of South Africa?',
        options: ['Nairobi', 'Cairo', 'Pretoria (Executive)', 'Johannesburg'],
        correctOptionIndex: 2,
        timeLimit: 20
      }
    ]
  },
  {
    id: 'brain-quiz',
    title: 'Mind-Boggling Riddles',
    description: 'Fun, tricky riddles to get your classroom thinking outside the box!',
    category: 'Fun',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'riddle-q1',
        text: 'What has keys but can’t open locks, with space but no room, and you can enter but can’t go inside?',
        options: ['A piano', 'A map', 'A keyboard', 'An envelope'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'riddle-q2',
        text: 'The more of them you take, the more you leave behind. What are they?',
        options: ['Steps/Footprints', 'Sighs', 'Photos', 'Minutes'],
        correctOptionIndex: 0,
        timeLimit: 15
      },
      {
        id: 'riddle-q3',
        text: 'I am light as a feather, yet the strongest person cannot hold me for much longer than a minute. What am I?',
        options: ['A bubble', 'Your breath', 'Water', 'A shadow'],
        correctOptionIndex: 1,
        timeLimit: 15
      }
    ]
  },
  {
    id: 'sql-quiz',
    title: 'Advanced SQL: Indexing, Views & Stored Procedures',
    description: 'A comprehensive evaluation of SQL databases covering Indexes, Virtual & Materialized Views, and Stored Procedures. Tailored for college students and database operators.',
    category: 'IT',
    createdAt: new Date().toISOString(),
    questions: [
      // Section 1: SQL Indexing
      {
        id: 'sql-q1',
        text: 'What is the primary purpose of creating an index in a SQL database?',
        options: ['Reduces storage space', 'Speeds up data retrieval', 'Enforces data encryption', 'Prevents duplicate rows'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q2',
        text: 'Which type of index physically reorders the data rows in a table based on the key values?',
        options: ['Non-clustered index', 'Clustered index', 'Filtered index', 'Composite index'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q3',
        text: 'True or False: A standard database table can have multiple clustered indexes.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
        timeLimit: 10
      },
      {
        id: 'sql-q4',
        text: 'What is a downside of having too many indexes on a single table?',
        options: ['Queries become slower', 'INSERT, UPDATE, and DELETE operations become slower', 'The database automatically crashes', 'Users lose read access to the data'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q5',
        text: 'Which data structure is most commonly used by modern relational databases to implement indexes?',
        options: ['Linked List', 'Hash Map', 'B-Tree / B+ Tree', 'Binary Search Tree'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'sql-q6',
        text: 'An index created on more than one column is known as a...',
        options: ['Multi-index', 'Composite index', 'Unique index', 'Clustered index'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q7',
        text: 'What kind of scan occurs when the database engine has to search the entire table row-by-row because no usable index exists?',
        options: ['Index Seek', 'Index Scan', 'Table Scan (or Full Table Scan)', 'Pointer Scan'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'sql-q8',
        text: 'Which type of index is automatically created when you define a PRIMARY KEY constraint on a table?',
        options: ['Clustered Index (usually)', 'Non-clustered Index only', 'Filtered Index', 'Bitmap Index'],
        correctOptionIndex: 0,
        timeLimit: 20
      },
      {
        id: 'sql-q9',
        text: 'What does an "Index Seek" operation mean?',
        options: ['The database is searching for a deleted index', 'The database uses the index tree to directly find specific rows', 'The database is scanning the entire index from start to finish', 'The index is broken and needs to be rebuilt'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q10',
        text: 'What is a "Filtered Index"?',
        options: ['An index that removes NULL values automatically', 'An index that only works for admin users', 'A non-clustered index that uses a WHERE clause to index a subset of rows', 'An index used exclusively for text searching'],
        correctOptionIndex: 2,
        timeLimit: 30
      },

      // Section 2: SQL Views
      {
        id: 'sql-q11',
        text: 'What is a SQL View?',
        options: ['A physical table stored on the hard drive', 'A virtual table based on the result-set of a SQL statement', 'A tool used to backup database logs', 'A graphical chart representing data'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q12',
        text: 'True or False: A standard view contains its own copy of the data rows.',
        options: ['True', 'False'],
        correctOptionIndex: 1,
        timeLimit: 10
      },
      {
        id: 'sql-q13',
        text: 'Which command is used to modify the definition of an existing view?',
        options: ['UPDATE VIEW', 'MODIFY VIEW', 'ALTER VIEW', 'CHANGE VIEW'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'sql-q14',
        text: 'What type of view physically stores the query results and updates them when the underlying data changes?',
        options: ['Dynamic View', 'Materialized View (or Indexed View)', 'Static View', 'Temporary View'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q15',
        text: 'Why would a database administrator use a view for security purposes?',
        options: ['To encrypt data passwords', 'To restrict user access to specific columns or rows without changing table permissions', 'To block hacker IP addresses', 'To speed up user login times'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q16',
        text: 'Can you perform an INSERT statement on a view?',
        options: ['No, views are strictly read-only', 'Yes, but only if the view references a single base table and meets specific criteria', 'Yes, views always allow inserts', 'Yes, but only if the view uses a GROUP BY clause'],
        correctOptionIndex: 1,
        timeLimit: 30
      },
      {
        id: 'sql-q17',
        text: 'What happens to a view if the underlying table is dropped?',
        options: ['The view automatically copies the table data to save it', 'The view drops automatically as well', 'The view becomes invalid and will throw an error when queried', 'The view creates a blank table to replace it'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'sql-q18',
        text: 'What does the WITH CHECK OPTION do when creating a view?',
        options: ['It checks the syntax of the view for errors', 'It prevents modifications that would make rows disappear from the view\'s filter', 'It automatically creates an index on the view', 'It requires a password to query the view'],
        correctOptionIndex: 1,
        timeLimit: 30
      },
      {
        id: 'sql-q19',
        text: 'Which clause is generally NOT allowed in a basic view definition unless a TOP or LIMIT clause is also used?',
        options: ['WHERE', 'JOIN', 'ORDER BY', 'GROUP BY'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'sql-q20',
        text: 'To remove a view from the database entirely, which command do you use?',
        options: ['DELETE VIEW view_name', 'DROP VIEW view_name', 'REMOVE VIEW view_name', 'CLEAR VIEW view_name'],
        correctOptionIndex: 1,
        timeLimit: 20
      },

      // Section 3: SQL Stored Procedures
      {
        id: 'sql-q21',
        text: 'What is a SQL Stored Procedure?',
        options: ['A method for storing backups', 'A prepared piece of SQL code that you can save and reuse over and over', 'A security protocol for database servers', 'A type of table constraint'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q22',
        text: 'How do you execute a stored procedure named GetEmployees?',
        options: ['RUN GetEmployees', 'START GetEmployees', 'EXEC GetEmployees (or CALL GetEmployees)', 'SELECT GetEmployees'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'sql-q23',
        text: 'What is a key performance advantage of using Stored Procedures?',
        options: ['They compress the database size', 'Their execution plans are compiled and cached by the database engine', 'They bypass the database security layer', 'They eliminate the need for primary keys'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q24',
        text: 'Stored procedures can accept parameters. What are the two main types of parameters?',
        options: ['Read and Write', 'Input (IN) and Output (OUT)', 'Static and Dynamic', 'Import and Export'],
        correctOptionIndex: 1,
        timeLimit: 20
      },
      {
        id: 'sql-q25',
        text: 'How do Stored Procedures help protect against SQL Injection attacks?',
        options: ['By automatically encrypting the entire database', 'By forcing the use of parameterized inputs', 'By banning the word DROP from user inputs', 'They don\'t; procedures are highly vulnerable to injection'],
        correctOptionIndex: 1,
        timeLimit: 30
      },
      {
        id: 'sql-q26',
        text: 'What is a major difference between a User-Defined Function (UDF) and a Stored Procedure?',
        options: ['Functions can have output parameters, procedures cannot', 'Procedures can perform transaction controls (COMMIT/ROLLBACK), functions cannot', 'Procedures must return a value, functions do not', 'Functions can modify database state, procedures are read-only'],
        correctOptionIndex: 1,
        timeLimit: 30
      },
      {
        id: 'sql-q27',
        text: 'Which keyword is used to pass data back to the calling program from a stored procedure?',
        options: ['RETURN_DATA', 'SEND', 'OUTPUT (or OUT)', 'EXPORT'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'sql-q28',
        text: 'What command is used to delete a stored procedure from the database?',
        options: ['DELETE PROCEDURE', 'REMOVE PROCEDURE', 'DROP PROCEDURE', 'CLEAR PROCEDURE'],
        correctOptionIndex: 2,
        timeLimit: 20
      },
      {
        id: 'sql-q29',
        text: 'True or False: A stored procedure can call another stored procedure.',
        options: ['True', 'False'],
        correctOptionIndex: 0,
        timeLimit: 10
      },
      {
        id: 'sql-q30',
        text: 'What keyword is used within a stored procedure to handle runtime errors and undo changes if something goes wrong?',
        options: ['CATCH ALTERATION', 'ROLLBACK TRANSACTION', 'UNDO INSERT', 'RESET DATABASE'],
        correctOptionIndex: 1,
        timeLimit: 20
      }
    ]
  }
];
