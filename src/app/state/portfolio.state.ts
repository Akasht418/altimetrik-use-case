import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { tap } from 'rxjs/operators';


export class LoadDashboardData {
  static readonly type = '[Dashboard] Load Data';
}

export class AddInvestment {
  static readonly type = '[Dashboard] Add Investment';
  constructor(public payload: any) {}
}

export interface DashboardModel {
  data: any;
}

@State<DashboardModel>({
  name: 'dashboard',
  defaults: {
    data: null,
  },
})
@Injectable()
export class DashboardState {
  constructor(private apiService: ApiService) {}

  @Selector()
  static getDashboardData(state: DashboardModel) {
    return state.data;
  }

  @Action(LoadDashboardData)
  loadDashboardData(ctx: StateContext<DashboardModel>) {
    return this.apiService.getDashboardData().pipe(
      tap((result) => {
        ctx.patchState({ data: result });
      })
    );
  }

  @Action(AddInvestment)
  addInvestment(ctx: StateContext<DashboardModel>, action: AddInvestment) {
    const state = ctx.getState();
    const updatedData = {
      ...state.data,
      assetAllocation: [...(state.data?.assetAllocation || []), action.payload],
    };
    ctx.patchState({ data: updatedData });
  }
}
