import { Serie } from "@youwol/dataframe"
import { covariance } from "./covariance"

/**
 * Compute variance of a Serie
 * @category Dataframe/stats
 */
export const variance = (x: Serie): number => covariance(x,x)
