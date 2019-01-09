import {Subscription} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {Exercise} from './exercise.model';
import {UiService} from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import * as UI from '../shared/ui.actions';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UiService,
              private store: Store<fromTraining.State>) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(map((docs) => {
          return docs.map((doc) => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            } as Exercise;
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new Training.SetAvailableExercises(exercises));
      }, () => {
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackBar('Fetching failed. Try again.', null, 3000);
      }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartExercise(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveExercise)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          state: 'completed',
          date: new Date()
        });

      this.store.dispatch(new Training.StopExercise());
    });
  }

  cancelExercise(progress) {
    this.store.select(fromTraining.getActiveExercise)
      .pipe(take(1))
      .subscribe(ex => {
        this.addDataToDatabase({
          ...ex,
          calories: ex.calories * (progress / 100),
          duration: ex.duration * (progress / 100),
          state: 'cancelled',
          date: new Date()
        });

      this.store.dispatch(new Training.StopExercise());
    });
  }

  private addDataToDatabase(exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedExercises(exercises));
      }));
  }
}
