import {request} from '@/http/axios'

import type {AbnormalAccountsResponse, OwnerCompletionListResponse, WeeklyCompletionResponse} from './types'

/**
 * 获取本周任务完成度
 * @returns 本周任务完成度数据
 */
export const getWeeklyCompletion =
    () => {
      return request<WeeklyCompletionResponse>({
        url: '/account/weekly_completion',
        method: 'GET',
      })
    }

/**
 * 获取每个责任人的任务完成度
 * @returns 责任人完成度列表
 */
export const getOwnerCompletion =
    () => {
      return request<OwnerCompletionListResponse>({
        url: '/account/owner_completion',
        method: 'GET',
      })
    }

/**
 * 下载指定责任人完成的账号信息
 * @param owner 责任人名称
 * @returns 文件下载响应
 */
export const downloadCompletedAccounts =
    (owner: string) => {
      return request({
        url: '/account/download_completed_accounts',
        method: 'GET',
        params: {owner},
        responseType: 'blob'  // 指定响应类型为二进制数据
      })
    }

/**
 * 获取异常账号列表(分页)
 * @param page 页码(从1开始)
 * @param per_page 每页数量(默认10)
 * @returns 分页的异常账号列表
 */
export const getAbnormalAccounts = (page = 1, per_page = 10) => {
  return request<AbnormalAccountsResponse>({
    url: '/account/abnormal_accounts',
    method: 'GET',
    params: {
      page,
      per_page
    }
  })
}
