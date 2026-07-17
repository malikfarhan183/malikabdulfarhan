import {getProjectRepository} from '../providers/repositoryFactory';

export async function getHealth() {
  return {
    data: await getProjectRepository().getHealth(),
  };
}
