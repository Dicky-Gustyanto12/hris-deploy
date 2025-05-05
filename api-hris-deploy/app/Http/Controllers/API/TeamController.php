<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\Team;
use Illuminate\Http\Request;
use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTeamRequest;
use App\Http\Requests\UpdateTeamRequest;

class TeamController extends Controller
{
    private function makeIconPublicUrl($path)
    {
        return $path ? asset('storage/' . ltrim(str_replace('public/', '', $path), '/')) : null;
    }

    public function create(CreateTeamRequest $request)
    {
        try {
            $path = null;

            if ($request->hasFile('icon')) {
                $path = $request->file('icon')->store('icons', 'public');
            }

            $team = Team::create([
                'name' => $request->name,
                'icon' => $path ?? '',
                'company_id' => $request->company_id,
            ]);

            if (!$team) {
                throw new Exception('Team creation failed');
            }

            $team->icon = $this->makeIconPublicUrl($team->icon);

            return ResponseFormatter::success($team, 'Team created successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function fetch(Request $request)
    {
        $id = $request->input('id');
        $name = $request->input('name');
        $limit = $request->input('limit', 10);

        $teamQuery = Team::withCount('employees');

        if ($id) {
            $team = $teamQuery->find($id);
            if ($team) {
                $team->icon = $this->makeIconPublicUrl($team->icon);
                return ResponseFormatter::success($team, 'Team found');
            }
            return ResponseFormatter::error('Team not found', 404);
        }

        $teams = $teamQuery->where('company_id', $request->company_id);
        if ($name) {
            $teams->where('name', 'like', '%' . $name . '%');
        }

        $paginated = $teams->paginate($limit);

        $paginated->getCollection()->transform(function ($team) {
            $team->icon = $this->makeIconPublicUrl($team->icon);
            return $team;
        });

        return ResponseFormatter::success($paginated, 'Teams found');
    }

    public function update(Request $request, $id)
    {
        try {
            $team = Team::findOrFail($id);

            $team->name = $request->name;
            $team->company_id = $request->company_id;

            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('icons', 'public');
                $team->icon = $path;
            }

            $team->save();
            $team->icon = $this->makeIconPublicUrl($team->icon);

            return ResponseFormatter::success($team, 'Team updated successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $team = Team::findOrFail($id);
            $team->delete();

            return ResponseFormatter::success(null, 'Team deleted successfully');
        } catch (Exception $e) {
            return ResponseFormatter::error($e->getMessage(), 500);
        }
    }
}
