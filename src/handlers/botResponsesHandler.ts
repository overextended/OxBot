import { guidelines } from '../constants';
import responsesData from '../utils/botResponses.json';

const processResponse = (response: string) => {
  return response.replace(/{guidelines}/g, guidelines);
};

const guidelineResponses = Object.fromEntries(
  Object.entries(responsesData.guidelineResponses).map(([key, value]) => [key, value.map(processResponse)])
);

const resourceResponses = responsesData.resourceResponses.map(processResponse);
const cooldownResponses = responsesData.cooldownResponses.map(processResponse);

export { guidelineResponses, resourceResponses, cooldownResponses };
