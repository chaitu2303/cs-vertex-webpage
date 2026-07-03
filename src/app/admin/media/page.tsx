export const dynamic = "force-dynamic";
import { getMediaFiles } from './actions'
import MediaClient from './MediaClient'

export const revalidate = 0

export default async function MediaAdmin() {
  const files = await getMediaFiles()
  return <MediaClient initialFiles={files} />
}



