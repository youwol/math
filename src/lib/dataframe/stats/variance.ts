import { ASerie } from "@youwol/dataframe"
import { covariance } from "./covariance"

/**
 * Compute variance of a Serie
 * @category Dataframe
 */
export const variance = (x: ASerie): number => covariance(x,x)
