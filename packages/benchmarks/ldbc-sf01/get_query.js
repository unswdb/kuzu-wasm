const fs = require('fs');
const path = require('path');
function getImportQueries(datasetPath) {
  return [
    `create node table Person (ID INT64,firstName STRING,lastName STRING,gender STRING,birthday DATE,creationDate TIMESTAMP,locationIP STRING,browserUsed STRING, PRIMARY KEY(ID))`,
    `copy Person from "${datasetPath}/person_0_0.csv" (HEADER=true, DELIM="|")`,
    `create node table Forum (ID INT64,title STRING,creationDate TIMESTAMP, PRIMARY KEY(ID))`,
    `copy Forum from "${datasetPath}/forum_0_0.csv" (HEADER=true, DELIM="|")`,
    `create node table Post (ID INT64,imageFile STRING,creationDate TIMESTAMP,locationIP STRING,browserUsed STRING,language STRING,content STRING,length INT64, PRIMARY KEY(ID))`,
    `copy Post from "${datasetPath}/post_0_0.csv" (HEADER=true, DELIM="|")`,
    `create node table Comment (ID INT64,creationDate TIMESTAMP,locationIP STRING,browserUsed STRING,content STRING,length INT64, PRIMARY KEY(ID))`,
    `copy Comment from "${datasetPath}/comment_0_0.csv" (HEADER=true, DELIM="|")`,
    `create node table Tag (ID INT64,name STRING,url STRING, PRIMARY KEY(ID))`,
    `copy Tag from "${datasetPath}/tag_0_0.csv" (HEADER=true, DELIM="|")`,
    `create node table Tagclass (ID INT64,name STRING,url STRING, PRIMARY KEY(ID))`,
    `copy Tagclass from "${datasetPath}/tagclass_0_0.csv" (HEADER=true, DELIM="|")`,
    `create node table Place (ID INT64,name STRING,url STRING,type STRING, PRIMARY KEY(ID))`,
    `copy Place from "${datasetPath}/place_0_0.csv" (HEADER=true, DELIM="|")`,
    `create node table Organisation (ID INT64,type STRING,name STRING,url STRING, PRIMARY KEY(ID))`,
    `copy Organisation from "${datasetPath}/organisation_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table containerOf (FROM Forum TO Post,ONE_MANY)`,
    `copy containerOf from "${datasetPath}/forum_containerOf_post_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table comment_hasCreator (FROM Comment TO Person, MANY_ONE)`,
    `copy comment_hasCreator from "${datasetPath}/comment_hasCreator_person_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table post_hasCreator (FROM Post TO Person,MANY_ONE)`,
    `copy post_hasCreator from "${datasetPath}/post_hasCreator_person_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table hasInterest (FROM Person TO Tag, MANY_MANY)`,
    `copy hasInterest from "${datasetPath}/person_hasInterest_tag_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table hasMember (FROM Forum TO Person,joinDate TIMESTAMP,MANY_MANY)`,
    `copy hasMember from "${datasetPath}/forum_hasMember_person_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table hasModerator (FROM Forum TO Person,MANY_ONE)`,
    `copy hasModerator from "${datasetPath}/forum_hasModerator_person_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table comment_hasTag (FROM Comment TO Tag,MANY_MANY)`,
    `copy comment_hasTag from "${datasetPath}/comment_hasTag_tag_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table forum_hasTag (FROM Forum TO Tag,MANY_MANY)`,
    `copy forum_hasTag from "${datasetPath}/forum_hasTag_tag_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table post_hasTag (FROM Post TO Tag,MANY_MANY)`,
    `copy post_hasTag from "${datasetPath}/post_hasTag_tag_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table hasType (FROM Tag TO Tagclass,MANY_ONE)`,
    `copy hasType from "${datasetPath}/tag_hasType_tagclass_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table comment_isLocatedIn (FROM Comment TO Place,MANY_ONE)`,
    `copy comment_isLocatedIn from "${datasetPath}/comment_isLocatedIn_place_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table organisation_isLocatedIn (FROM Organisation TO Place,MANY_ONE)`,
    `copy organisation_isLocatedIn from "${datasetPath}/organisation_isLocatedIn_place_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table person_isLocatedIn (FROM Person TO Place,MANY_ONE)`,
    `copy person_isLocatedIn from "${datasetPath}/person_isLocatedIn_place_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table post_isLocatedIn (FROM Post TO Place,MANY_ONE)`,
    `copy post_isLocatedIn from "${datasetPath}/post_isLocatedIn_place_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table isPartOf (FROM Place TO Place,MANY_ONE)`,
    `copy isPartOf from "${datasetPath}/place_isPartOf_place_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table isSubclassOf (FROM Tagclass TO Tagclass,MANY_ONE)`,
    `copy isSubclassOf from "${datasetPath}/tagclass_isSubclassOf_tagclass_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table knows (FROM Person TO Person,creationDate TIMESTAMP,MANY_MANY)`,
    `copy knows from "${datasetPath}/person_knows_person_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table likes_comment (FROM Person TO Comment,creationDate TIMESTAMP,MANY_MANY)`,
    `copy likes_comment from "${datasetPath}/person_likes_comment_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table likes_post (FROM Person TO Post,creationDate TIMESTAMP,MANY_MANY)`,
    `copy likes_post from "${datasetPath}/person_likes_post_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table replyOf_comment (FROM Comment TO Comment,MANY_ONE)`,
    `copy replyOf_comment from "${datasetPath}/comment_replyOf_comment_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table replyOf_post (FROM Comment TO Post,MANY_ONE)`,
    `copy replyOf_post from "${datasetPath}/comment_replyOf_post_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table studyAt (FROM Person TO Organisation,classYear INT64,MANY_MANY)`,
    `copy studyAt from "${datasetPath}/person_studyAt_organisation_0_0.csv" (HEADER=true, DELIM="|")`,
    `create rel table workAt (FROM Person TO Organisation,workFrom INT64,MANY_MANY)`,
    `copy workAt from "${datasetPath}/person_workAt_organisation_0_0.csv" (HEADER=true, DELIM="|")`,
  ];
}
const benchmarkQueries = [
  {
    queryGroup: 'aggregation',
    name: 'q24',
    query: 'MATCH(comment:Comment) RETURN comment.length % 1, count(comment.ID)'
  },
  {
    queryGroup: 'aggregation',
    name: 'q28',
    query: 'MATCH(comment:Comment) WHERE comment.ID < 33980465466560 RETURN comment.ID as ID, count(comment.length) order by ID LIMIT 5;'
  },
  {
    queryGroup: 'filter',
    name: 'q14',
    query: 'MATCH (comment:Comment) WHERE comment.length < 3 RETURN count(*)'
  },
  {
    queryGroup: 'filter',
    name: 'q15',
    query: 'MATCH (comment:Comment) WHERE comment.length < 150 RETURN count(*)'
  },
  {
    queryGroup: 'filter',
    name: 'q16',
    query: 'MATCH (comment:Comment) WHERE comment.length < 5 or comment.length > 100 RETURN count(*)'
  },
  {
    queryGroup: 'filter',
    name: 'q17',
    query: 'MATCH (comment:Comment) WHERE comment.length < comment.ID % 10 RETURN count(*)'
  },
  {
    queryGroup: 'filter',
    name: 'q18',
    query: "MATCH (comment:Comment) WHERE substr(comment.browserUsed, 1, 2) = 'Ch' RETURN count(*)"
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q07',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length * 2 * 2 * 2 * 2)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q08',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length + 2 + 2 + 2 + 2 + 2 + 2)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q09',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length - 2 - 2 - 2 - 2 - 2 - 2)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q10',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length / 2)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q11',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length % 111)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q12',
    query: 'MATCH (comment:Comment) RETURN MIN(abs(comment.length))'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q13',
    query: 'MATCH (comment:Comment) RETURN MIN(gamma(comment.length % 2 + 2))'
  },
  {
    queryGroup: 'fixed_size_seq_scan',
    name: 'q23',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length)'
  },
  {
    queryGroup: 'join',
    name: 'q29',
    query: 'MATCH (a:Person)-[:knows]->(b:Person) RETURN MIN(a.birthday), MIN(b.birthday)'
  },
  {
    queryGroup: 'join',
    name: 'q30',
    query: 'MATCH (a:Person)-[:knows]->(b:Person)-[:knows]->(c:Person) RETURN MIN(a.birthday), MIN(b.birthday), MIN(c.birthday)'
  },
  {
    queryGroup: 'join',
    name: 'q31',
    query: 'MATCH (a:Person)-[:knows]->(b:Person) WHERE a.ID=933 RETURN MIN(a.birthday), MIN(b.birthday)'
  },
  {
    queryGroup: 'ldbc_snb_ic',
    name: 'q35',
    query: "MATCH (:Person {ID: 10995116278009})-[:knows]->(friend:Person)<-[:comment_hasCreator|:post_hasCreator]-(message:Post:Comment) WHERE message.creationDate < timestamp('2010-02-14 20:30:21.451') RETURN friend.ID AS personId, friend.firstName AS personFirstName, friend.lastName AS personLastName, message.ID AS postOrCommentId, concat(message.content,message.imageFile) AS postOrCommentContent, message.creationDate AS postOrCommentCreationDate ORDER BY postOrCommentCreationDate DESC, postOrCommentId ASC LIMIT 20"
  },
  {
    queryGroup: 'ldbc_snb_ic',
    name: 'q36',
    query: "MATCH (person:Person {ID: 10995116277918})-[:knows*1..2]->(friend:Person) WHERE person.ID <> friend.ID WITH DISTINCT friend MATCH (friend)-[workAt:workAt]->(company:Organisation)-[:organisation_isLocatedIn]->(:Place {name: 'Hungary'}) WHERE workAt.workFrom < 2011 RETURN friend.ID AS personId, friend.firstName AS personFirstName, friend.lastName AS personLastName, company.name AS organizationName, workAt.workFrom AS organizationWorkFromYear ORDER BY organizationWorkFromYear ASC, personId ASC, organizationName DESC LIMIT 10"
  },
  {
    queryGroup: 'ldbc_snb_is',
    name: 'q32',
    query: 'MATCH (n:Person)-[:person_isLocatedIn]->(p:Place) WHERE n.ID = 1129 RETURN n.firstName AS firstName, n.lastName AS lastName,n.birthday AS birthday, n.locationIP AS locationIP, n.browserUsed AS browserUsed,p.ID AS cityId,n.gender AS gender,n.creationDate AS creationDate'
  },
  {
    queryGroup: 'ldbc_snb_is',
    name: 'q33',
    query: 'MATCH (n:Person {ID: 933})-[r:knows]->(friend) RETURN friend.ID AS personId, friend.firstName AS firstName, friend.lastName AS lastName, r.creationDate AS friendshipCreationDate ORDER BY friendshipCreationDate DESC, personId ASC'
  },
  {
    queryGroup: 'ldbc_snb_is',
    name: 'q34',
    query: 'MATCH (c:Comment {ID: 2061584302085})-[:comment_hasCreator]->(p:Person) RETURN p.ID AS personId, p.firstName AS firstName, p.lastName AS lastName;'
  },
  {
    queryGroup: 'order_by',
    name: 'q25',
    query: 'MATCH (comment:Comment) RETURN comment.length ORDER BY comment.length LIMIT 5'
  },
  {
    queryGroup: 'order_by',
    name: 'q26',
    query: 'MATCH (comment:Comment) return comment.length,comment.creationDate ORDER BY comment.length, comment.creationDate LIMIT 5'
  },
  {
    queryGroup: 'order_by',
    name: 'q27',
    query: 'MATCH (comment:Comment) RETURN comment.browserUsed ORDER BY comment.browserUsed LIMIT 5'
  },
  {
    queryGroup: 'scan_after_filter',
    name: 'q01',
    query: 'MATCH (comment:Comment) WHERE comment.length < 10 RETURN MIN(comment.ID)'
  },
  {
    queryGroup: 'scan_after_filter',
    name: 'q02',
    query: 'MATCH (comment:Comment) WHERE comment.length > 200 RETURN MIN(comment.ID)'
  },
  {
    queryGroup: 'shortest_path_ldbc100',
    name: 'q39',
    query: 'MATCH (a:Person)-[r:knows* SHORTEST 1..30]->(b:Person) WHERE a.ID = 94 AND b.ID = 30786325764357 RETURN length(r)'
  },
  {
    queryGroup: 'var_size_expr_evaluator',
    name: 'q03',
    query: "MATCH (comment:Comment) RETURN MIN(concat(comment.browserUsed, 'hh'))"
  },
  {
    queryGroup: 'var_size_expr_evaluator',
    name: 'q04',
    query: 'MATCH (comment:Comment) RETURN MIN(substr(comment.browserUsed,1,5))'
  },
  {
    queryGroup: 'var_size_expr_evaluator',
    name: 'q05',
    query: 'MATCH (comment:Comment) RETURN MIN(upper(comment.browserUsed))'
  },
  {
    queryGroup: 'var_size_expr_evaluator',
    name: 'q06',
    query: "MATCH (comment:Comment) RETURN MIN(comment.browserUsed contains 'ed')"
  },
  {
    queryGroup: 'var_size_seq_scan',
    name: 'q19',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.browserUsed)'
  },
  {
    queryGroup: 'var_size_seq_scan',
    name: 'q20',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.locationIP)'
  },
  {
    queryGroup: 'var_size_seq_scan',
    name: 'q21',
    query: 'MATCH (comment:Comment) RETURN SIZE(MIN(comment.content))'
  },
  {
    queryGroup: 'var_size_seq_scan',
    name: 'q22',
    query: 'MATCH (post:Post) RETURN MIN(post.language)'
  }
];

const benchmarkQueries_neo4j = [
  {
    queryGroup: 'aggregation',
    name: 'q24',
    query: 'MATCH (comment:Comment) RETURN comment.length % 1, count(comment.ID)'
  },
  {
    queryGroup: 'aggregation',
    name: 'q28',
    query: 'MATCH (comment:Comment) WHERE comment.ID < 33980465466560 RETURN comment.ID as ID, count(comment.length) order by ID LIMIT 5;'
  },
  {
    queryGroup: 'filter',
    name: 'q14',
    query: 'MATCH (comment:Comment) WHERE comment.length < 3 RETURN count(*)'
  },
  {
    queryGroup: 'filter',
    name: 'q15',
    query: 'MATCH (comment:Comment) WHERE comment.length < 150 RETURN count(*)'
  },
  {
    queryGroup: 'filter',
    name: 'q16',
    query: 'MATCH (comment:Comment) WHERE comment.length < 5 or comment.length > 100 RETURN count(*)'
  },
  {
    queryGroup: 'filter',
    name: 'q17',
    query: 'MATCH (comment:Comment) WHERE comment.length < comment.ID % 10 RETURN count(*)'
  },
  {
    queryGroup: 'filter',
    name: 'q18',
    query: "MATCH (comment:Comment) WHERE substring(comment.browserUsed, 1, 2) = 'Ch' RETURN count(*)"
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q07',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length * 2 * 2 * 2 * 2)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q08',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length + 2 + 2 + 2 + 2 + 2 + 2)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q09',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length - 2 - 2 - 2 - 2 - 2 - 2)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q10',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length / 2)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q11',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length % 111)'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q12',
    query: 'MATCH (comment:Comment) RETURN MIN(abs(comment.length))'
  },
  {
    queryGroup: 'fixed_size_expr_evaluator',
    name: 'q13',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length % 2 + 2) AS result'
  },
  {
    queryGroup: 'fixed_size_seq_scan',
    name: 'q23',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.length)'
  },
  {
    queryGroup: 'join',
    name: 'q29',
    query: 'MATCH (a:Person)-[:knows]->(b:Person) RETURN MIN(a.birthday), MIN(b.birthday)'
  },
  {
    queryGroup: 'join',
    name: 'q30',
    query: 'MATCH (a:Person)-[:knows]->(b:Person)-[:knows]->(c:Person) RETURN MIN(a.birthday), MIN(b.birthday), MIN(c.birthday)'
  },
  {
    queryGroup: 'join',
    name: 'q31',
    query: 'MATCH (a:Person)-[:knows]->(b:Person) WHERE a.ID=933 RETURN MIN(a.birthday), MIN(b.birthday)'
  },
  {
    queryGroup: 'ldbc_snb_ic',
    name: 'q35',
    query: "MATCH (:Person {ID: 10995116278009})-[:knows]->(friend:Person)<-[:comment_hasCreator|:post_hasCreator]-(message:Post:Comment) WHERE message.creationDate < timestamp('2010-02-14 20:30:21.451') RETURN friend.ID AS personId, friend.firstName AS personFirstName, friend.lastName AS personLastName, message.ID AS postOrCommentId, (message.content + message.imageFile) AS postOrCommentContent, message.creationDate AS postOrCommentCreationDate ORDER BY postOrCommentCreationDate DESC, postOrCommentId ASC LIMIT 20"
  },
  {
    queryGroup: 'ldbc_snb_ic',
    name: 'q36',
    query: "MATCH (person:Person {ID: 10995116277918})-[:knows*1..2]->(friend:Person) WHERE person.ID <> friend.ID WITH DISTINCT friend MATCH (friend)-[workAt:workAt]->(company:Organisation)-[:organisation_isLocatedIn]->(:Place {name: 'Hungary'}) WHERE workAt.workFrom < 2011 RETURN friend.ID AS personId, friend.firstName AS personFirstName, friend.lastName AS personLastName, company.name AS organizationName, workAt.workFrom AS organizationWorkFromYear ORDER BY organizationWorkFromYear ASC, personId ASC, organizationName DESC LIMIT 10"
  },
  {
    queryGroup: 'ldbc_snb_is',
    name: 'q32',
    query: 'MATCH (n:Person)-[:person_isLocatedIn]->(p:Place) WHERE n.ID = 1129 RETURN n.firstName AS firstName, n.lastName AS lastName,n.birthday AS birthday, n.locationIP AS locationIP, n.browserUsed AS browserUsed,p.ID AS cityId,n.gender AS gender,n.creationDate AS creationDate'
  },
  {
    queryGroup: 'ldbc_snb_is',
    name: 'q33',
    query: 'MATCH (n:Person {ID: 933})-[r:knows]->(friend) RETURN friend.ID AS personId, friend.firstName AS firstName, friend.lastName AS lastName, r.creationDate AS friendshipCreationDate ORDER BY friendshipCreationDate DESC, personId ASC'
  },
  {
    queryGroup: 'ldbc_snb_is',
    name: 'q34',
    query: 'MATCH (c:Comment {ID: 2061584302085})-[:comment_hasCreator]->(p:Person) RETURN p.ID AS personId, p.firstName AS firstName, p.lastName AS lastName;'
  },
  {
    queryGroup: 'order_by',
    name: 'q25',
    query: 'MATCH (comment:Comment) RETURN comment.length ORDER BY comment.length LIMIT 5'
  },
  {
    queryGroup: 'order_by',
    name: 'q26',
    query: 'MATCH (comment:Comment) return comment.length,comment.creationDate ORDER BY comment.length, comment.creationDate LIMIT 5'
  },
  {
    queryGroup: 'order_by',
    name: 'q27',
    query: 'MATCH (comment:Comment) RETURN comment.browserUsed ORDER BY comment.browserUsed LIMIT 5'
  },
  {
    queryGroup: 'scan_after_filter',
    name: 'q01',
    query: 'MATCH (comment:Comment) WHERE comment.length < 10 RETURN MIN(comment.ID)'
  },
  {
    queryGroup: 'scan_after_filter',
    name: 'q02',
    query: 'MATCH (comment:Comment) WHERE comment.length > 10 RETURN MIN(comment.ID)'
  },
  {
    queryGroup: 'shortest_path_ldbc100',
    name: 'q39',
    query: 'MATCH p=allShortestPaths((a:Person)-[:knows*1..30]-(b:Person)) WHERE a.ID = 94 AND b.ID = 30786325764357 RETURN length(p)'
  },
  {
    queryGroup: 'var_size_expr_evaluator',
    name: 'q03',
    query: "MATCH (comment:Comment) RETURN MIN(comment.browserUsed + 'hh')"
  },
  {
    queryGroup: 'var_size_expr_evaluator',
    name: 'q04',
    query: 'MATCH (comment:Comment) RETURN MIN(substring(comment.browserUsed,1,5))'
  },
  {
    queryGroup: 'var_size_expr_evaluator',
    name: 'q05',
    query: 'MATCH (comment:Comment) RETURN MIN(toUpper(comment.browserUsed))'
  },
  {
    queryGroup: 'var_size_expr_evaluator',
    name: 'q06',
    query: "MATCH (comment:Comment) RETURN MIN(comment.browserUsed CONTAINS 'ed')"
  },
  {
    queryGroup: 'var_size_seq_scan',
    name: 'q19',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.browserUsed)'
  },
  {
    queryGroup: 'var_size_seq_scan',
    name: 'q20',
    query: 'MATCH (comment:Comment) RETURN MIN(comment.locationIP)'
  },
  {
    queryGroup: 'var_size_seq_scan',
    name: 'q21',
    query: 'MATCH (comment:Comment) RETURN comment.content'
  },
  {
    queryGroup: 'var_size_seq_scan',
    name: 'q22',
    query: 'MATCH (post:Post) RETURN MIN(post.language)'
  }
];
// const benchmarkFiles = [];
// // Recursive function to find all .benchmark files
// function findBenchmarkFiles(dir) {
//   const files = fs.readdirSync(dir);
//   files.forEach(file => {
//     const fullPath = path.join(dir, file);
//     const stat = fs.statSync(fullPath);
//     if (stat.isDirectory()) {
//       findBenchmarkFiles(fullPath); // Recursively traverse subdirectories
//     } else if (file.endsWith('.benchmark')) {
//       benchmarkFiles.push(fullPath); // Save .benchmark file path
//     }
//   });
// }
// // Read and parse .benchmark file
// function parseBenchmarkFile(filePath) {
//   const content = fs.readFileSync(filePath, 'utf-8');
//   const lines = content.split('\n');
//   let name = '';
//   let query = '';
//   lines.forEach(line => {
//     if (line.startsWith('-NAME')) {
//       name = line.replace('-NAME ', '').trim();
//     } else if (line.startsWith('-QUERY')) {
//       query = line.replace('-QUERY ', '').trim();
//     }
//   });
//   return { name, query };
// }
// const queryPath = path.resolve(__dirname, '..', '..','..','kuzu','benchmark','queries','ldbc-sf100');
// // Get all .benchmark files
// findBenchmarkFiles(queryPath); // Start from the current directory
// // Parse and output results
// const benchmarkQueries = benchmarkFiles.map(file => {
//   const parsedData = parseBenchmarkFile(file);
//   const queryGroup = path.basename(path.dirname(file)); 
//   return {
//     queryGroup: queryGroup,
//     name: parsedData.name,
//     query: parsedData.query,
//   };
// });
module.exports = {getImportQueries,benchmarkQueries,benchmarkQueries_neo4j};
