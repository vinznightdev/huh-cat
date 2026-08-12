/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RetroWindow {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  width: string | number;
  height: string | number;
  zIndex: number;
}

export interface MemeTemplate {
  id: string;
  url: string;
  title: string;
}

export interface JumpscareCat {
  id: string;
  name: string;
  image: string; // fallback if image fails, we draw beautiful animated faces/expressions
  phrase: string;
  soundType: 'huh' | 'screech' | 'error';
}
