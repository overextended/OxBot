import { promises as fs } from 'fs';
import logger from '../utils/logger';

interface Stats {
    ignored_guidelines: number;
    resource_questions: number;
}

const filePath = '../stats.json';
let stats: Stats;

/* Didn't want to use fs, but I'm not sure what else to use atm */
const loadStats = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        stats = JSON.parse(data);
        logger.info(`Stats loaded successfully`);
    } catch (error) {
        logger.error('Failed to read statistics file, initializing default values:', error);
        stats = { ignored_guidelines: 0, resource_questions: 0 };
    }
};

const saveStats = async () => {
    try {
        const data = JSON.stringify(stats, null, 4);
        await fs.writeFile(filePath, data, 'utf-8');
        logger.info('Stats saved successfully');
    } catch (error) {
        logger.error('Failed to save stats:', error);
    }
};

export const updateStat = (key: keyof Stats, increment: number = 1): void => {
    stats[key] += increment;
}

export const getStat = (key: keyof Stats): number => {
    return stats[key];
}

/* Don't think it's necessary to do it too frequently */
setInterval(saveStats, 60 * 60 * 1000);

loadStats().then(() => {
    saveStats();
});
