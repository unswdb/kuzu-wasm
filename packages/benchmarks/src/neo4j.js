const neo4j = require('neo4j-driver');

// Neo4j config
const uri = 'bolt://localhost:7687'; // for Docker use bolt://localhost:7687，Neo4j Desktop use bolt://localhost:7687
const user = 'neo4j';
const password = ''; // change it for 'password'

// create instance
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();
const { benchmarkQueries,benchmarkQueries_neo4j } = require('../ldbc-sf01/get_query');

// Function to get Neo4j version
const getNeo4jVersion = async () => {
    try {
      const result = await session.run('CALL dbms.components() YIELD name, versions, edition RETURN name, versions, edition');
      const record = result.records[0];
      const name = record.get('name');
      const versions = record.get('versions');
      const edition = record.get('edition');
  
      console.log(`Name: ${name}`);
      console.log(`Versions: ${versions}`);
      console.log(`Edition: ${edition}`);
    } catch (error) {
      console.error('Error fetching version information:', error);
    }
  };

module.exports = { session, getNeo4jVersion };

