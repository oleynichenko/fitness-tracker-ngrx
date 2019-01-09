import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {PastTrainingsComponent} from './past-trainings/past-trainings.component';
import {TrainingComponent} from './training/training.component';
import {NewTrainingComponent} from './new-training/new-training.component';
import {CurrentTrainingComponent} from './current-training/current-training.component';
import {StopTrainingComponent} from './stop-training.component';
import {SharedModule} from '../shared/shared.module';
import {TrainingRoutingModule} from './training-routing.module';
import {trainingReducer} from './training.reducer';

@NgModule({
  declarations: [
    PastTrainingsComponent,
    NewTrainingComponent,
    CurrentTrainingComponent,
    TrainingComponent,
    StopTrainingComponent,
  ],
  imports: [
    StoreModule.forFeature('training', trainingReducer),
    SharedModule,
    TrainingRoutingModule
  ],
  entryComponents: [StopTrainingComponent]
})
export class TrainingModule {}
