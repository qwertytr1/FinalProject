const axios = require('axios');

const JIRA_BASE_URL = 'https://mahnach20040208.atlassian.net';
const JIRA_API_TOKEN = 'ATATT3xFfGF0uufOvkSD2PtsFnzp1ClPgUxP1YBF-jNR6hpLLvvwtP7OIazUv6E-xsh0YAIFJcyyQu5-ioMFtVHr9ba-OqHWdkW4TKuXV4SEhLrAdZu_ksEJXMiFV09m4qBGbfJlYCPPCkMZBl-sWhNKGBtuor2f2Q1NXCv7cUzaOFPrA97rUbY=B9F6026D';
const JIRA_EMAIL = 'mahnach20040208@gmail.com';
const JIRA_PROJECT_KEY = 'GGG';

async function createJiraTicket(req, res) {
  const { summary, priority, status, reportedBy, template, link } = req.body;

  try {
    const response = await axios.post(
      `${JIRA_BASE_URL}/rest/api/3/issue`,
      {
        fields: {
          project: {
            key: JIRA_PROJECT_KEY,
          },
          summary: summary,
          description: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `Reported by: ${reportedBy}\nTemplate: ${template}\nLink: ${link}\nPriority: ${priority}\nStatus: ${status}`,
                  },
                ],
              },
            ],
          },
          issuetype: {
            name: 'Task',
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString(
            'base64'
          )}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ ticketLink: `${JIRA_BASE_URL}/browse/${response.data.key}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating ticket in Jira',
      details: error.response ? error.response.data : error.message,
    });
  }
}
async function getJiraTickets(req, res) {
    const { status, page = 1, limit = 10 } = req.query; // параметры для фильтрации и пагинации

    try {
      // Фильтрация по статусу (если статус указан)
      const jqlQuery = status ? `project = ${JIRA_PROJECT_KEY} AND status = "${status}"` : `project = ${JIRA_PROJECT_KEY}`;

      const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/search`, {
        params: {
          jql: jqlQuery,
          startAt: (page - 1) * limit,
          maxResults: limit,
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      const issues = response.data.issues;
      const total = response.data.total; // общее количество задач

      res.json({
        issues,
        total,
        page,
        totalPages: Math.ceil(total / limit), // расчет общего числа страниц
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({
        message: 'Error fetching tickets from Jira',
        details: error.response ? error.response.data : error.message,
      });
    }
  }

module.exports = { createJiraTicket, getJiraTickets };
